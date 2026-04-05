import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response.model';
import { TruckRequest, TruckResponse, TruckSearchFilters, RejectRequest } from '../models/truck.model';

@Injectable({ providedIn: 'root' })
export class TruckService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/trucks`;

  getAll(page = 0, size = 10) {
    return this.http.get<PageResponse<TruckResponse>>(`${this.base}?page=${page}&size=${size}`);
  }

  getAvailable(page = 0, size = 20, filters?: TruckSearchFilters) {
    let params = `page=${page}&size=${size}`;
    if (filters) {
      if (filters.search) params += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.minPrice != null) params += `&minPrice=${filters.minPrice}`;
      if (filters.maxPrice != null) params += `&maxPrice=${filters.maxPrice}`;
      if (filters.minCapacity != null) params += `&minCapacity=${filters.minCapacity}`;
      if (filters.maxCapacity != null) params += `&maxCapacity=${filters.maxCapacity}`;
      if (filters.transmission) params += `&transmission=${filters.transmission}`;
      if (filters.fuel) params += `&fuel=${filters.fuel}`;
    }
    return this.http.get<PageResponse<TruckResponse>>(`${this.base}/available?${params}`);
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