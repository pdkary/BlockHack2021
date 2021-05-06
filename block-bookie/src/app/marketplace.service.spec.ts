import { TestBed } from '@angular/core/testing';

import { MarketplaceServiceService } from './marketplace-service.service';

describe('MarketplaceServiceService', () => {
  let service: MarketplaceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketplaceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
