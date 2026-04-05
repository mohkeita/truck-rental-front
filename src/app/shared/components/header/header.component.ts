import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a routerLink="/" class="flex items-center gap-2">
            <span class="text-2xl">🚛</span>
            <span class="text-xl font-bold text-foreground font-heading">TruckRental</span>
          </a>

          <nav class="hidden md:flex items-center gap-1">
            <a routerLink="/" routerLinkActive="text-primary bg-secondary" [routerLinkActiveOptions]="{exact: true}"
              class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              Accueil
            </a>
            <a routerLink="/trucks" routerLinkActive="text-primary bg-secondary"
              class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              Camions
            </a>
            <a routerLink="/contact" routerLinkActive="text-primary bg-secondary"
              class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              Contact
            </a>
          </nav>

          <div class="hidden md:flex items-center gap-3">
            @if (authService.isAuthenticated()) {
              <button (click)="goToDashboard()"
                class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Tableau de bord
              </button>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {{ userInitial() }}
                </div>
                <button (click)="logout()" class="text-sm text-muted-foreground hover:text-destructive transition-colors">
                  Déconnexion
                </button>
              </div>
            } @else {
              <button (click)="login()" class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Connexion
              </button>
              <button (click)="register()" class="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                S'inscrire
              </button>
            }
          </div>

          <button (click)="toggleMobile()" class="md:hidden p-2 text-muted-foreground hover:text-foreground">
            @if (mobileOpen()) {
              <span class="text-xl">&#10005;</span>
            } @else {
              <span class="text-xl">&#9776;</span>
            }
          </button>
        </div>
      </div>

      @if (mobileOpen()) {
        <div class="md:hidden border-t border-border bg-background">
          <nav class="px-4 py-3 space-y-1">
            <a routerLink="/" (click)="closeMobile()" class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">Accueil</a>
            <a routerLink="/trucks" (click)="closeMobile()" class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">Camions</a>
            <a routerLink="/contact" (click)="closeMobile()" class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">Contact</a>
          </nav>
          <div class="px-4 py-3 border-t border-border space-y-2">
            @if (authService.isAuthenticated()) {
              <button (click)="goToDashboard(); closeMobile()" class="block w-full text-left px-3 py-2 text-sm text-foreground">Tableau de bord</button>
              <button (click)="logout()" class="block w-full text-left px-3 py-2 text-sm text-destructive">Déconnexion</button>
            } @else {
              <button (click)="login()" class="block w-full text-left px-3 py-2 text-sm text-foreground">Connexion</button>
              <button (click)="register()" class="block w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium text-center">S'inscrire</button>
            }
          </div>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  mobileOpen = signal(false);

  userInitial = () => {
    const user = this.authService.currentUser();
    return user?.username?.charAt(0).toUpperCase() ?? '';
  };

  toggleMobile() { this.mobileOpen.update(v => !v); }
  closeMobile() { this.mobileOpen.set(false); }

  login() { this.authService.login(); }
  register() { this.authService.register(); }
  logout() { this.authService.logout(); }

  goToDashboard() {
    this.authService.navigateToDashboard();
    this.closeMobile();
  }
}
