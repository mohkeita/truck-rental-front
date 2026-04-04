import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response.model';
import { TruckRequest, TruckResponse, RejectRequest } from '../models/truck.model';

@Injectable({ providedIn: 'root' })
export class TruckService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/trucks`;

  getAll(page = 0, size = 10) {
    return this.http.get<PageResponse<TruckResponse>>(`${this.base}?page=${page}&size=${size}`);
  }

  getAvailable(page = 0, size = 20) {
    return this.http.get<PageResponse<TruckResponse>>(`${this.base}/available?page=${page}&size=${size}`);
  }

  getById(id: number) {
    return this.http.get<TruckResponse>(`${this.base}/${id}`);
  }

  getAvailableById(id: number) {
    return this.http.get<TruckResponse>(`${this.base}/available/${id}`);
  }

  create(truck: TruckRequest) {
    return this.http.post<TruckResponse>(this.base, truck);
  }

  approve(id: number) {
    return this.http.put<TruckResponse>(`${this.base}/${id}/approve`, {});
  }

  reject(id: number, body: RejectRequest) {
    return this.http.put<TruckResponse>(`${this.base}/${id}/reject`, body);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  uploadPhotos(id: number, files: File[]) {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    return this.http.post<string[]>(`${this.base}/${id}/photos`, formData);
  }
}