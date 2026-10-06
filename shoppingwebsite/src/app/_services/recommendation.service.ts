import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Recommendation, RecommendationResponse } from '../_models/recommendation';
import { AppConfigService } from './app-config.service';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  constructor(private http: HttpClient, private appConfig: AppConfigService) { }

  // The JWT has no email claim, so read it from the Spring Boot user profile
  getCurrentUserEmail(): Observable<string> {
    return this.http
      .get<{ email: string }>(`${environment.apiUrl}user/me`)
      .pipe(map(user => user.email));
  }

  getRecommendations(email: string, excludeProductIds: string[] = []): Observable<Recommendation[]> {
    return this.http
      .post<RecommendationResponse>(`${this.appConfig.recommendationApiUrl}api/recommendations`, {
        email,
        excludeProductIds
      })
      // already relevance-sorted by the API; sort again so the UI never depends on it
      .pipe(map(res => [...res.recommendations].sort((a, b) => a.rank - b.rank)));
  }

  getRecommendationsForCurrentUser(excludeProductIds: string[] = []): Observable<Recommendation[]> {
    return this.getCurrentUserEmail().pipe(
      switchMap(email => this.getRecommendations(email, excludeProductIds))
    );
  }
}
