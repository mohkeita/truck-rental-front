import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-background">

      <!-- Sidebar -->
      <aside [class]="sidebarOpen() ? 'w-64' : 'w-16'"
        class="bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 flex-shrink-0">

        <!-- Logo -->
        <div class="h-16 flex items-center px-4 border-b border-sidebar-border gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 glow-amber">
            <span class="text-base">🚛</span>
          </div>
          @if (sidebarOpen()) {
            <span class="font-heading font-bold text-foreground uppercase tracking-wide text-sm whitespace-nowrap overflow-hidden">TruckAdmin</span>
          }
        </div>

        <!-- Nav -->
        <nav class="flex-1 py-4 px-2 space-y-1">
          @for (item of navItems; track item.route) {
            <a [routerLink]="item.route" routerLinkActive="bg-sidebar-accent text-sidebar-primary"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
              [title]="!sidebarOpen() ? item.label : ''">
              <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
              @if (sidebarOpen()) {
                <span class="text-sm font-medium whitespace-nowrap overflow-hidden">{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <!-- User + Logout -->
        <div class="border-t border-sidebar-border p-3 space-y-1">
          @if (sidebarOpen()) {
            <div class="flex items-center gap-3 px-2 py-2">
              <div class="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                {{ userInitial() }}
              </div>
              <span class="text-xs text-sidebar-foreground font-medium truncate">{{ username() }}</span>
            </div>
          }
          <button (click)="logout()"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
            [title]="!sidebarOpen() ? 'Déconnexion' : ''">
            <span class="text-base flex-shrink-0">🚪</span>
            @if (sidebarOpen()) {
              <span class="text-sm font-medium">Déconnexion</span>
            }
          </button>
          <button (click)="sidebarOpen.set(!sidebarOpen())"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <span class="text-base flex-shrink-0">{{ sidebarOpen() ? '◀' : '▶' }}</span>
            @if (sidebarOpen()) {
              <span class="text-sm font-medium">Réduire</span>
            }
          </button>
        </div>
      </aside>

      <!-- Main -->
      <main class="flex-1 flex flex-col min-w-0">
        <header class="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
          <h1 class="text-lg font-heading font-bold text-gradient uppercase tracking-wide">Administration</h1>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
              {{ userInitial() }}
            </div>
            <span class="text-sm text-muted-foreground">{{ username() }}</span>
          </div>
        </header>
        <div class="flex-1 p-6 overflow-auto">
          <router-outlet />
        </div>
      </main>

    </div>
  `,
})
export class AdminLayoutComponent {
  sidebarOpen = signal(true);

  navItems: NavItem[] = [
    { icon: '📊', label: 'Tableau de bord', route: '/admin/dashboard' },
    { icon: '🚛', label: 'Camions', route: '/admin/trucks' },
    { icon: '📋', label: 'Réservations', route: '/admin/bookings' },
    { icon: '📍', label: 'Lieux', route: '/admin/locations' },
    { icon: '👨‍✈️', label: 'Chauffeurs', route: '/admin/drivers' },
    { icon: '👥', label: 'Clients', route: '/admin/clients' },
    { icon: '📄', label: 'Contrats', route: '/admin/contracts' },
    { icon: '💰', label: 'Factures', route: '/admin/invoices' },
    { icon: '🗺️', label: 'Missions', route: '/admin/missions' },
  ];

  constructor(private authService: AuthService) {}

  username = computed(() => this.authService.currentUser()?.username ?? '');
  userInitial = computed(() => this.username().charAt(0).toUpperCase());

  logout() {
    this.authService.logout();
  }
}
