import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <aside [class]="sidebarOpen() ? 'w-64' : 'w-16'"
             class="bg-gray-900 text-white flex flex-col transition-all duration-300 relative">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
          <span class="text-2xl">🚛</span>
          @if (sidebarOpen()) {
            <span class="font-bold text-lg">TruckAdmin</span>
          }
        </div>

        <!-- Nav items -->
        <nav class="flex-1 py-4 overflow-y-auto">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="text-orange-400 bg-gray-800"
              class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <span class="text-xl flex-shrink-0">{{ item.icon }}</span>
              @if (sidebarOpen()) {
                <span class="text-sm font-medium">{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <!-- Toggle button -->
        <button
          (click)="sidebarOpen.set(!sidebarOpen())"
          class="absolute -right-3 top-20 bg-gray-900 border border-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white text-xs"
        >
          {{ sidebarOpen() ? '◀' : '▶' }}
        </button>

        <!-- User section -->
        <div class="border-t border-gray-700 p-4">
          @if (sidebarOpen()) {
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
                {{ userInitial() }}
              </div>
              <div>
                <p class="text-sm font-medium">{{ username() }}</p>
                <p class="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          }
          <button
            (click)="logout()"
            class="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm w-full"
          >
            <span>🚪</span>
            @if (sidebarOpen()) { <span>Logout</span> }
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <h2 class="text-xl font-bold text-gray-900">Admin Dashboard</h2>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
              {{ userInitial() }}
            </div>
            <span class="text-sm text-gray-600">{{ username() }}</span>
          </div>
        </header>

        <!-- Page content -->
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  sidebarOpen = signal(true);

  navItems: NavItem[] = [
    { path: '/admin/trucks', label: 'Trucks', icon: '🚛' },
    { path: '/admin/drivers', label: 'Drivers', icon: '👨‍✈️' },
    { path: '/admin/clients', label: 'Clients', icon: '👥' },
    { path: '/admin/contracts', label: 'Contracts', icon: '📄' },
    { path: '/admin/invoices', label: 'Invoices', icon: '💰' },
    { path: '/admin/missions', label: 'Missions', icon: '📍' },
  ];

  username = () => this.authService.currentUser()?.username ?? '';
  userInitial = () => this.username().charAt(0).toUpperCase();

  logout(): void {
    this.authService.logout();
  }
}
