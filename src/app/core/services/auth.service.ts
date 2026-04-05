import { Injectable, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from './keycloak.service';

export interface CurrentUser {
  username: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloakService = inject(KeycloakService);
  private router = inject(Router);

  readonly isAuthenticated = this.keycloakService.authenticated;
  readonly role = this.keycloakService.role;

  readonly currentUser = computed<CurrentUser | null>(() => {
    const username = this.keycloakService.username();
    const role = this.keycloakService.role();
    if (username && role) {
      return { username, role };
    }
    return null;
  });

  getToken(): string | undefined {
    return this.keycloakService.getToken();
  }

  login(redirectUri?: string): Promise<void> {
    return this.keycloakService.login(redirectUri);
  }

  register(redirectUri?: string): Promise<void> {
    return this.keycloakService.register(redirectUri);
  }

  logout(): void {
    this.keycloakService.logout();
  }

  navigateToDashboard(): void {
    const role = this.role();
    if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else if (role === 'OWNER') {
      this.router.navigate(['/owner/dashboard']);
    } else {
      this.router.navigate(['/client/bookings']);
    }
  }
}
