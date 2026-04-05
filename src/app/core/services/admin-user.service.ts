import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminUser, ChangeRoleRequest, SetEnabledRequest, UserRole } from '../models/admin-user.model';

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

  setEnabled(id: string, enabled: boolean) {
    return this.http.put<void>(`${this.base}/${id}/enabled`, { enabled } as SetEnabledRequest);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
