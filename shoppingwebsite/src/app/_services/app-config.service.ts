import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, of, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppConfig {
  recommendationApiUrl: string;
  geoapifyApiKey: string;
}

// Wait at most this long for the backend before starting with the environment.ts values
const LOAD_TIMEOUT_MS = 3000;

/**
 * Settings that can change without rebuilding Angular. Loaded once at startup from the
 * Spring Boot endpoint GET /app-config (filled from environment variables on the server).
 * Values from environment.ts are used when the backend is unreachable or returns an empty value.
 */
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private http: HttpClient;
  private config: AppConfig = {
    recommendationApiUrl: environment.recommendationApiUrl,
    geoapifyApiKey: environment.geoapifyApiKey
  };

  // HttpBackend skips the interceptors: this runs before anything else is set up
  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  get recommendationApiUrl(): string {
    return this.config.recommendationApiUrl;
  }

  get geoapifyApiKey(): string {
    return this.config.geoapifyApiKey;
  }

  load(): Promise<void> {
    return firstValueFrom(
      this.http.get<Partial<AppConfig>>(`${environment.apiUrl}app-config`).pipe(
        timeout(LOAD_TIMEOUT_MS),
        catchError(err => {
          console.log('Could not load /app-config, using environment.ts values', err);
          return of({} as Partial<AppConfig>);
        })
      )
    ).then(remote => {
      this.config = {
        recommendationApiUrl: remote.recommendationApiUrl || this.config.recommendationApiUrl,
        geoapifyApiKey: remote.geoapifyApiKey || this.config.geoapifyApiKey
      };
    });
  }
}
