import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminStatsResponse, OwnerStatsResponse } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/analytics`;

  getAdminStats() {
    return this.http.get<AdminStatsResponse>(`${this.base}/admin`);
  }

  getOwnerStats() {
    return this.http.get<OwnerStatsResponse>(`${this.base}/owner`);
  }
}
