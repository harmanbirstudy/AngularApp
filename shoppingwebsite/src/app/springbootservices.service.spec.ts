import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SpringbootservicesService } from './springbootservices.service';

describe('SpringbootservicesService', () => {
  let service: SpringbootservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SpringbootservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
