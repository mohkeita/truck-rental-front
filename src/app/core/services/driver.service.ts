import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response.model';
import { DriverRequest, DriverResponse } from '../models/driver.model';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/drivers`;

  getAll(page = 0, size = 10) {
    return this.http.get<PageResponse<DriverResponse>>(`${this.base}?page=${page}&size=${size}`);
  }

  getById(id: number) {
    return this.http.get<DriverResponse>(`${this.base}/${id}`);
  }

  create(driver: DriverRequest) {
    return this.http.post<DriverResponse>(this.base, driver);
  }

  update(id: number, driver: DriverRequest) {
    return this.http.put<DriverResponse>(`${this.base}/${id}`, driver);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}