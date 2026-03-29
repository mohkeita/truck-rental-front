import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="text-4xl mb-3">🚛</div>
          <h1 class="text-2xl font-bold text-gray-900">Create Account</h1>
          <p class="text-gray-500 mt-1">Join Truck Rental platform</p>
        </div>

        @if (error()) {
          <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {{ error() }}
          </div>
        }

        @if (success()) {
          <div class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Account created! <a routerLink="/auth/login" class="underline font-medium">Sign in now</a>
          </div>
        }

        <form (ngSubmit)="onSubmit()" #regForm="ngForm">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              [(ngModel)]="data.username"
              required minlength="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a username"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              [(ngModel)]="data.password"
              required minlength="6"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Choose a password"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">I want to</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="cursor-pointer">
                <input type="radio" name="role" value="OWNER" [(ngModel)]="data.role" class="sr-only" />
                <div [class]="data.role === 'OWNER'
                  ? 'border-2 border-orange-500 bg-orange-50 rounded-lg p-3 text-center'
                  : 'border-2 border-gray-200 rounded-lg p-3 text-center hover:border-orange-300'">
                  <div class="text-xl mb-1">🚛</div>
                  <div class="text-sm font-medium">List my trucks</div>
                  <div class="text-xs text-gray-500">Truck Owner</div>
                </div>
              </label>
              <label class="cursor-pointer">
                <input type="radio" name="role" value="CLIENT" [(ngModel)]="data.role" class="sr-only" />
                <div [class]="data.role === 'CLIENT'
                  ? 'border-2 border-blue-500 bg-blue-50 rounded-lg p-3 text-center'
                  : 'border-2 border-gray-200 rounded-lg p-3 text-center hover:border-blue-300'">
                  <div class="text-xl mb-1">📦</div>
                  <div class="text-sm font-medium">Rent trucks</div>
                  <div class="text-xs text-gray-500">Client</div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="loading() || !regForm.form.valid || !data.role"
            class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors"
          >
            @if (loading()) { Creating account... } @else { Create Account }
          </button>
        </form>

        <p class="text-center text-sm text-gray-500 mt-6">
          Already have an account?
          <a routerLink="/auth/login" class="text-blue-600 hover:underline font-medium">Sign in</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  data: { username: string; password: string; role: 'OWNER' | 'CLIENT' | '' } = {
    username: '',
    password: '',
    role: '',
  };

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  onSubmit(): void {
    if (!this.data.role) return;
    this.loading.set(true);
    this.error.set(null);

    this.authService.register({
      username: this.data.username,
      password: this.data.password,
      role: this.data.role as 'OWNER' | 'CLIENT',
    }).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'Registration failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}
