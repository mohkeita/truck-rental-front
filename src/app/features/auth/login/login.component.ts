import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">🚛</div>
          <h1 class="text-2xl font-bold text-gray-900">Truck Rental</h1>
          <p class="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        @if (error()) {
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              [(ngModel)]="credentials.username"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              [(ngModel)]="credentials.password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            [disabled]="loading() || !loginForm.form.valid"
            class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors"
          >
            @if (loading()) { Signing in... } @else { Sign In }
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Don't have an account?
          <a routerLink="/auth/register" class="text-blue-600 hover:underline font-medium">Register</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = { username: '', password: '' };
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit(): void {
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.credentials).subscribe({
      next: response => {
        const role = response.role;
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/trucks']);
        } else if (role === 'OWNER') {
          this.router.navigate(['/owner/trucks']);
        } else {
          this.router.navigate(['/client/trucks']);
        }
      },
      error: () => {
        this.error.set('Invalid username or password. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
