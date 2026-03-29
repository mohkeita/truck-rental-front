import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response.model';
import { MissionRequest, MissionResponse, MissionStatus } from '../models/mission.model';

@Injectable({ providedIn: 'root' })
export class MissionService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/missions`;

  getAll(page = 0, size = 10) {
    return this.http.get<PageResponse<MissionResponse>>(`${this.base}?page=${page}&size=${size}`);
  }

  getById(id: number) {
    return this.http.get<MissionResponse>(`${this.base}/${id}`);
  }

  create(mission: MissionRequest) {
    return this.http.post<MissionResponse>(this.base, mission);
  }

  updateStatus(id: number, status: MissionStatus) {
    return this.http.put<MissionResponse>(`${this.base}/${id}/status`, { status });
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}