import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-gray-50">

      <!-- Mobile overlay -->
      @if (sidebarOpen()) {
        <div class="fixed inset-0 bg-black/50 z-20 md:hidden" (click)="sidebarOpen.set(false)"></div>
      }

      <!-- Sidebar -->
      <aside [class.translate-x-0]="sidebarOpen()"
        class="fixed inset-y-0 left-0 z-30 w-64 -translate-x-full bg-gray-900 text-white flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:z-auto">
        <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
          <span class="text-2xl">📦</span>
          <span class="font-bold text-lg">TruckRental</span>
        </div>

        <nav class="flex-1 py-4">
          <a routerLink="/client/trucks" routerLinkActive="text-orange-400 bg-gray-800" (click)="closeMobile()"
            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <span class="text-xl">🚛</span>
            <span class="text-sm font-medium">Camions disponibles</span>
          </a>
          <a routerLink="/client/bookings" routerLinkActive="text-orange-400 bg-gray-800" (click)="closeMobile()"
            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <span class="text-xl">📋</span>
            <span class="text-sm font-medium">Mes réservations</span>
          </a>
          <a routerLink="/client/contracts" routerLinkActive="text-orange-400 bg-gray-800" (click)="closeMobile()"
            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <span class="text-xl">📄</span>
            <span class="text-sm font-medium">Mes contrats</span>
          </a>
        </nav>

        <div class="border-t border-gray-700 p-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {{ userInitial() }}
            </div>
            <div>
              <p class="text-sm font-medium">{{ username() }}</p>
              <p class="text-xs text-gray-400">Client</p>
            </div>
          </div>
          <button (click)="logout()"
            class="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm">
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      <div class="flex-1 flex flex-col min-w-0">
        <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm flex items-center gap-3">
          <button (click)="sidebarOpen.set(!sidebarOpen())" class="md:hidden text-gray-600 hover:text-gray-900">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h2 class="text-lg sm:text-xl font-bold text-gray-900">Espace Client</h2>
        </header>
        <main class="flex-1 overflow-y-auto p-4 sm:p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class ClientLayoutComponent {
  private authService = inject(AuthService);
  sidebarOpen = signal(false);
  username = () => this.authService.currentUser()?.username ?? '';
  userInitial = () => this.username().charAt(0).toUpperCase();
  logout(): void { this.authService.logout(); }
  closeMobile(): void { this.sidebarOpen.set(false); }
}
