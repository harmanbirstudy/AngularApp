import { ChangeDetectionStrategy, Component, ElementRef, OnInit, input, output, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RecommendationService } from '../_services/recommendation.service';
import { Recommendation } from '../_models/recommendation';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-product-recommendations',
  imports: [CurrencyPipe],
  templateUrl: './product-recommendations.component.html',
  styleUrls: ['./product-recommendations.component.scss']
})
export class ProductRecommendationsComponent implements OnInit {
  // products already in the cart, so they are not recommended again
  excludeProductIds = input<string[]>([]);
  // emitted when the user clicks "Add to Cart"; the host page adds it to the cart
  addToCart = output<Recommendation>();

  recommendations = signal<Recommendation[]>([]);
  loading = signal(true);

  private scroller = viewChild<ElementRef<HTMLElement>>('scroller');

  constructor(private recommendationService: RecommendationService) { }

  ngOnInit(): void {
    this.recommendationService.getRecommendationsForCurrentUser(this.excludeProductIds()).subscribe({
      next: recs => {
        this.recommendations.set(recs);
        this.loading.set(false);
      },
      error: err => {
        // recommendations are optional on the cart page: hide the section on failure
        console.log(err);
        this.loading.set(false);
      }
    });
  }

  add(p: Recommendation) {
    this.addToCart.emit(p);
    // it's in the cart now, so stop recommending it
    this.recommendations.update(recs => recs.filter(r => r.productid !== p.productid));
  }

  scroll(direction: 1 | -1) {
    const el = this.scroller()?.nativeElement;
    el?.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }
}
