import { Injectable, signal, computed } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: Keycloak;
  private _authenticated = signal(false);
  private _username = signal<string | null>(null);
  private _roles = signal<string[]>([]);

  readonly authenticated = this._authenticated.asReadonly();
  readonly username = this._username.asReadonly();
  readonly roles = this._roles.asReadonly();

  readonly role = computed(() => {
    const roles = this._roles();
    if (roles.includes('ADMIN')) return 'ADMIN';
    if (roles.includes('OWNER')) return 'OWNER';
    if (roles.includes('CLIENT')) return 'CLIENT';
    return null;
  });

  constructor() {
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    });
  }

  async init(): Promise<boolean> {
    const authenticated = await this.keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      checkLoginIframe: false,
    });

    this.updateState(authenticated);

    this.keycloak.onTokenExpired = () => {
      this.keycloak.updateToken(30).catch(() => {
        this.logout();
      });
    };

    this.keycloak.onAuthRefreshError = () => {
      this.logout();
    };

    return authenticated;
  }

  login(redirectUri?: string): Promise<void> {
    return this.keycloak.login({ redirectUri: redirectUri || window.location.origin });
  }

  register(redirectUri?: string): Promise<void> {
    return this.keycloak.register({ redirectUri: redirectUri || window.location.origin });
  }

  logout(): Promise<void> {
    this._authenticated.set(false);
    this._username.set(null);
    this._roles.set([]);
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  async updateToken(minValidity: number = 30): Promise<string | undefined> {
    await this.keycloak.updateToken(minValidity);
    return this.keycloak.token;
  }

  private updateState(authenticated: boolean): void {
    this._authenticated.set(authenticated);
    if (authenticated && this.keycloak.tokenParsed) {
      this._username.set(this.keycloak.tokenParsed['preferred_username'] ?? null);
      const realmAccess = this.keycloak.tokenParsed['realm_access'];
      const roles = (realmAccess?.roles ?? []) as string[];
      this._roles.set(roles.map(r => r.toUpperCase()));
    } else {
      this._username.set(null);
      this._roles.set([]);
    }
  }
}
