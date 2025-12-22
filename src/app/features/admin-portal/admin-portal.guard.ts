import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EToken, EUserType } from '@core/constants';
import { AuthService } from '@shared/services/api/auth/auth.service';
import { UserStateService } from '@shared/services/state/user.state.service';
import { catchError, map, of } from 'rxjs';

export const adminPortalGuard: CanActivateFn = () => {
  const authToken = localStorage.getItem(EToken.Auth);
  const authService = inject(AuthService);
  const router = inject(Router);
  const userStateService = inject(UserStateService);

  if (!authToken) {
    router.navigate(['auth']);
    return false;
  }

  const navigateToAuth = () => {
    localStorage.removeItem(EToken.Auth);
    router.navigate(['auth']);
  };

  return authService.me().pipe(
    map((user) => {
      if (user.type !== EUserType.Admin) {
        navigateToAuth();
        return false;
      }

      userStateService.setUserState(user);
      return true;
    }),
    catchError(() => {
      navigateToAuth();
      return of(false);
    }),
  );
};
