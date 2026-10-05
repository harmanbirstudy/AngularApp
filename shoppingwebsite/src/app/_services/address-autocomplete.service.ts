import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';

// Free OpenStreetMap geocoder (no API key): https://photon.komoot.io
const PHOTON_URL = 'https://photon.komoot.io/api/';
// Free zip -> city lookup (no API key), used when OpenStreetMap has no city for an address
const ZIPPOPOTAM_URL = 'https://api.zippopotam.us/';

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
  private zipCityCache = new Map<string, Observable<string>>();

  // HttpBackend skips the interceptors, so the JWT is never sent to the third-party API
  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  search(query: string): Observable<AddressSuggestion[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('limit', 5)
      .set('lang', 'en')
      .append('layer', 'house')
      .append('layer', 'street');

    return this.http.get<any>(PHOTON_URL, { params }).pipe(
      map(res => (res.features || []).map((f: any) => this.toSuggestion(f.properties))),
      switchMap((suggestions: AddressSuggestion[]) => suggestions.length ?
        forkJoin(suggestions.map(s => this.fillMissingCity(s))) : of([]))
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

  private toSuggestion(p: any): AddressSuggestion {
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
