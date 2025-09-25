import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminPortalGuard } from './admin-portal.guard';

describe('adminPortalGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminPortalGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
