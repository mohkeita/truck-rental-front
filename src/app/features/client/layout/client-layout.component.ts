import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-gray-50">
      <aside class="w-64 bg-gray-900 text-white flex flex-col">
        <div class="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
          <span class="text-2xl">📦</span>
          <span class="font-bold text-lg">TruckRental</span>
        </div>

        <nav class="flex-1 py-4">
          <a routerLink="/client/trucks" routerLinkActive="text-orange-400 bg-gray-800"
            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <span class="text-xl">🚛</span>
            <span class="text-sm font-medium">Available Trucks</span>
          </a>
          <a routerLink="/client/contracts" routerLinkActive="text-orange-400 bg-gray-800"
            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <span class="text-xl">📄</span>
            <span class="text-sm font-medium">My Contracts</span>
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
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <div class="flex-1 flex flex-col overflow-hidden">
        <header class="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <h2 class="text-xl font-bold text-gray-900">Client Portal</h2>
        </header>
        <main class="flex-1 overflow-y-auto p-6">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class ClientLayoutComponent {
  private authService = inject(AuthService);
  username = () => this.authService.currentUser()?.username ?? '';
  userInitial = () => this.username().charAt(0).toUpperCase();
  logout(): void { this.authService.logout(); }
}
