import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (!user) {
      return router.createUrlTree(['/auth/login']);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      const role = user.role.toLowerCase();
      return router.createUrlTree([`/${role}/trucks`]);
    }

    return true;
  };
};

export const adminGuard: CanActivateFn = authGuard(['ADMIN']);
export const ownerGuard: CanActivateFn = authGuard(['OWNER']);
export const clientGuard: CanActivateFn = authGuard(['CLIENT']);
