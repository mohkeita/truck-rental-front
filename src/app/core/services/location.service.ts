import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LocationRequest, LocationResponse } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/locations`;

  getAll() {
    return this.http.get<LocationResponse[]>(this.base);
  }

  getById(id: number) {
    return this.http.get<LocationResponse>(`${this.base}/${id}`);
  }

  create(location: LocationRequest) {
    return this.http.post<LocationResponse>(this.base, location);
  }

  update(id: number, location: LocationRequest) {
    return this.http.put<LocationResponse>(`${this.base}/${id}`, location);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
