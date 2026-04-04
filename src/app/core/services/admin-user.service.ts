import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminUser, ChangeRoleRequest, UserRole } from '../models/admin-user.model';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/admin/users`;

  list() {
    return this.http.get<AdminUser[]>(this.base);
  }

  changeRole(id: string, role: UserRole) {
    return this.http.put<void>(`${this.base}/${id}/role`, { role } as ChangeRoleRequest);
  }
}
