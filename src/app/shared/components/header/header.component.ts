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
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2.5">
            <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5"/>
              <path d="M15 7v4h5"/>
            </svg>
            <div class="flex flex-col">
              <span class="text-lg font-bold text-foreground font-heading leading-none">TruckRental</span>
              <span class="text-[9px] font-semibold tracking-[0.2em] text-primary uppercase leading-none mt-0.5">Location de camions</span>
            </div>
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden lg:flex items-center gap-1">
            <a routerLink="/" routerLinkActive="text-primary bg-secondary" [routerLinkActiveOptions]="{exact: true}"
              class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              Accueil
            </a>
            <a routerLink="/trucks" routerLinkActive="text-primary bg-secondary"
              class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              Catalogue
            </a>
            <a routerLink="/about" routerLinkActive="text-primary bg-secondary"
              class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              &Agrave; propos
            </a>
            <a routerLink="/faq" routerLinkActive="text-primary bg-secondary"
              class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              FAQ
            </a>
            <a routerLink="/contact" routerLinkActive="text-primary bg-secondary"
              class="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
              Contact
            </a>
          </nav>

          <!-- Desktop Auth -->
          <div class="hidden lg:flex items-center gap-3">
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
                  D&eacute;connexion
                </button>
              </div>
            } @else {
              <button (click)="login()" class="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Connexion
              </button>
              <a routerLink="/trucks" class="px-5 py-2 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                R&eacute;server
              </a>
            }
          </div>

          <!-- Mobile hamburger -->
          <button (click)="toggleMobile()" class="lg:hidden p-2 text-muted-foreground hover:text-foreground">
            @if (mobileOpen()) {
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            } @else {
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            }
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (mobileOpen()) {
        <div class="lg:hidden border-t border-border bg-background">
          <nav class="px-4 py-3 space-y-1">
            <a routerLink="/" (click)="closeMobile()" class="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">Accueil</a>
            <a routerLink="/trucks" (click)="closeMobile()" class="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">Catalogue</a>
            <a routerLink="/about" (click)="closeMobile()" class="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">&Agrave; propos</a>
            <a routerLink="/faq" (click)="closeMobile()" class="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">FAQ</a>
            <a routerLink="/contact" (click)="closeMobile()" class="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary">Contact</a>
          </nav>
          <div class="px-4 py-3 border-t border-border space-y-2">
            @if (authService.isAuthenticated()) {
              <button (click)="goToDashboard(); closeMobile()" class="block w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg">Tableau de bord</button>
              <button (click)="logout()" class="block w-full text-left px-3 py-2.5 text-sm text-destructive hover:bg-secondary rounded-lg">D&eacute;connexion</button>
            } @else {
              <button (click)="login()" class="block w-full text-left px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg">Connexion</button>
              <a routerLink="/trucks" (click)="closeMobile()" class="block w-full px-3 py-2.5 border border-primary text-primary rounded-lg text-sm font-medium text-center">R&eacute;server</a>
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
