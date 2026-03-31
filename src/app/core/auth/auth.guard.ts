import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (allowedRoles: string[]): CanActivateFn => {
  return async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      await authService.login(window.location.origin + state.url);
      return false;
    }

    const user = authService.currentUser();
    if (!user) {
      await authService.login(window.location.origin + state.url);
      return false;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return router.createUrlTree(['/']);
    }

    return true;
  };
};

export const adminGuard: CanActivateFn = authGuard(['ADMIN']);
export const ownerGuard: CanActivateFn = authGuard(['OWNER']);
export const clientGuard: CanActivateFn = authGuard(['CLIENT']);
