import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, catchError } from 'rxjs';
import { KeycloakService } from '../services/keycloak.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);
  const token = keycloakService.getToken();

  if (!token) {
    return next(req);
  }

  // Rafraîchir le token s'il expire dans les 30 prochaines secondes
  return from(keycloakService.updateToken(30)).pipe(
    switchMap(freshToken => {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${freshToken}` },
      });
      return next(authReq);
    }),
    catchError(() => {
      // Si le refresh échoue, envoyer avec le token actuel
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authReq);
    }),
  );
};
