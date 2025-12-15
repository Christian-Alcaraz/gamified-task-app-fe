import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@shared/services/api/auth/auth.service';
import { UserStateService } from '@shared/services/state/user.state.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authApiService = inject(AuthService);
  const userStateService = inject(UserStateService);
  const router = inject(Router);

  return authApiService.me().pipe(
    map((user) => {
      userStateService.setUserState(user);
      router.navigate(['hub']);
      return false;
    }),
    catchError(() => {
      return of(true);
    }),
  );
};
