import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: 'OWNER' | 'CLIENT';
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface CurrentUser {
  username: string;
  role: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _currentUser = signal<CurrentUser | null>(this.loadFromStorage());
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly role = computed(() => this._currentUser()?.role ?? null);

  private loadFromStorage(): CurrentUser | null {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (token && username && role) {
      return { token, username, role };
    }
    return null;
  }

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);
        this._currentUser.set({ token: response.token, username: response.username, role: response.role });
      })
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._currentUser()?.token ?? null;
  }
}