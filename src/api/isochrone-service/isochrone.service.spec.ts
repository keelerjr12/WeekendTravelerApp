import { TestBed } from '@angular/core/testing';

import { IsochroneService } from './isochrone.service';

describe('IsochroneServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IsochroneService = TestBed.get(IsochroneService);
    expect(service).toBeTruthy();
  });
});
