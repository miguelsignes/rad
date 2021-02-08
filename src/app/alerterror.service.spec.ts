import { TestBed } from '@angular/core/testing';

import { AlerterrorService } from './alerterror.service';

describe('AlerterrorService', () => {
  let service: AlerterrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlerterrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
