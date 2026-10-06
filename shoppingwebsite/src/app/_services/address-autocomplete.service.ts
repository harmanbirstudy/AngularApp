import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';
import { AppConfigService } from './app-config.service';

// Fast address autocomplete, free tier with an API key: https://www.geoapify.com
const GEOAPIFY_URL = 'https://api.geoapify.com/v1/geocode/autocomplete';
// Free OpenStreetMap geocoder (no API key, but slow): https://photon.komoot.io
const PHOTON_URL = 'https://photon.komoot.io/api/';
// Free zip -> city lookup (no API key), used when OpenStreetMap has no city for an address
const ZIPPOPOTAM_URL = 'https://api.zippopotam.us/';
// Number of recent searches kept in memory
const SEARCH_CACHE_SIZE = 50;

export interface AddressSuggestion {
  addline1: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  countrycode: string;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressAutocompleteService {
  private http: HttpClient;
  private searchCache = new Map<string, Observable<AddressSuggestion[]>>();
  private zipCityCache = new Map<string, Observable<string>>();

  // HttpBackend skips the interceptors, so the JWT is never sent to the third-party APIs
  constructor(handler: HttpBackend, private appConfig: AppConfigService) {
    this.http = new HttpClient(handler);
  }

  search(query: string): Observable<AddressSuggestion[]> {
    const key = query.trim().toLowerCase();
    let cached = this.searchCache.get(key);
    if (!cached) {
      cached = this.searchProviders(query).pipe(
        switchMap(suggestions => suggestions.length ?
          forkJoin(suggestions.map(s => this.fillMissingCity(s))) : of([])),
        shareReplay(1)
      );
      this.cacheSearch(key, cached);
    }
    return cached;
  }

  // Geoapify when a key is configured, Photon otherwise or when Geoapify fails (bad key, daily limit)
  private searchProviders(query: string): Observable<AddressSuggestion[]> {
    if (!this.appConfig.geoapifyApiKey) {
      return this.searchPhoton(query);
    }
    return this.searchGeoapify(query).pipe(
      catchError(() => this.searchPhoton(query))
    );
  }

  private cacheSearch(key: string, result: Observable<AddressSuggestion[]>) {
    if (this.searchCache.size >= SEARCH_CACHE_SIZE) {
      this.searchCache.delete(this.searchCache.keys().next().value!);
    }
    // drop failed searches so they are retried next time
    this.searchCache.set(key, result.pipe(catchError(err => {
      this.searchCache.delete(key);
      throw err;
    })));
  }

  private searchGeoapify(query: string): Observable<AddressSuggestion[]> {
    const params = new HttpParams()
      .set('text', query)
      .set('limit', 5)
      .set('lang', 'en')
      .set('format', 'json')
      .set('apiKey', this.appConfig.geoapifyApiKey);

    return this.http.get<any>(GEOAPIFY_URL, { params }).pipe(
      map(res => (res.results || []).map((r: any) => this.withLabel({
        addline1: r.housenumber ? `${r.housenumber} ${r.street || ''}`.trim() : (r.street || r.name || r.address_line1 || ''),
        city: r.city || r.town || r.village || r.suburb || '',
        state: r.state || '',
        zipcode: r.postcode || '',
        country: r.country || '',
        countrycode: (r.country_code || '').toLowerCase(),
        label: ''
      })))
    );
  }

  private searchPhoton(query: string): Observable<AddressSuggestion[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', 5)
      .set('lang', 'en')
      .append('layer', 'house')
      .append('layer', 'street');

    return this.http.get<any>(PHOTON_URL, { params }).pipe(
      map(res => (res.features || []).map((f: any) => this.fromPhoton(f.properties)))
    );
  }

  private fillMissingCity(s: AddressSuggestion): Observable<AddressSuggestion> {
    if (s.city || !s.zipcode || !s.countrycode) {
      return of(s);
    }
    return this.cityForZip(s.countrycode, s.zipcode).pipe(
      map(city => city ? this.withLabel({ ...s, city }) : s)
    );
  }

  private cityForZip(countrycode: string, zipcode: string): Observable<string> {
    const key = `${countrycode}/${zipcode}`;
    if (!this.zipCityCache.has(key)) {
      this.zipCityCache.set(key, this.http.get<any>(ZIPPOPOTAM_URL + key).pipe(
        map(res => res.places?.[0]?.['place name'] || ''),
        catchError(() => of('')),
        shareReplay(1)
      ));
    }
    return this.zipCityCache.get(key)!;
  }

  private fromPhoton(p: any): AddressSuggestion {
    const street = p.street || p.name || '';
    const addline1 = p.housenumber ? `${p.housenumber} ${street}` : street;
    const city = p.city || p.town || p.village || p.locality || p.district || '';
    return this.withLabel({
      addline1,
      city,
      state: p.state || '',
      zipcode: p.postcode || '',
      country: p.country || '',
      countrycode: (p.countrycode || '').toLowerCase(),
      label: ''
    });
  }

  private withLabel(s: AddressSuggestion): AddressSuggestion {
    s.label = [s.addline1, s.city, s.state, s.zipcode, s.country].filter(Boolean).join(', ');
    return s;
  }
}
