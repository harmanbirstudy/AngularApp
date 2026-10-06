import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ProductRecommendationsComponent } from './product-recommendations.component';
import { environment } from '../../environments/environment';

describe('ProductRecommendationsComponent', () => {
  let component: ProductRecommendationsComponent;
  let fixture: ComponentFixture<ProductRecommendationsComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRecommendationsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRecommendationsComponent);
    fixture.componentRef.setInput('excludeProductIds', ['in-cart']);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('loads the member email, then renders recommendations in rank order', () => {
    http.expectOne(`${environment.apiUrl}user/me`).flush({ email: 'chris.walker@example.com' });

    const req = http.expectOne(`${environment.recommendationApiUrl}api/recommendations`);
    expect(req.request.body).toEqual({ email: 'chris.walker@example.com', excludeProductIds: ['in-cart'] });
    const rec = (rank: number, title: string) => ({
      rank, productid: title, title, category: 'Books', price: 10, imageurl: null,
      relevanceScore: 90, modelScore: 0.5, reason: 'r', source: 'llm'
    });
    req.flush({ email: 'x', llmProvider: 'ollama', llmModel: 'm', llmUsed: true,
      recommendations: [rec(2, 'Second'), rec(1, 'First')] });
    fixture.detectChanges();

    const titles = Array.from(fixture.nativeElement.querySelectorAll('.card-title'))
      .map((el: any) => el.textContent.trim());
    expect(titles).toEqual(['First', 'Second']);
    expect(component.loading()).toBe(false);
  });

  it('hides the section when the API fails', () => {
    http.expectOne(`${environment.apiUrl}user/me`).flush('boom', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.recommendations')).toBeNull();
  });
});
