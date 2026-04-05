import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response.model';
import { BookingEstimateRequest, BookingEstimateResponse, BookingRequest, BookingResponse } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/bookings`;

  create(booking: BookingRequest) {
    return this.http.post<BookingResponse>(this.base, booking);
  }

  estimate(request: BookingEstimateRequest) {
    return this.http.post<BookingEstimateResponse>(`${this.base}/estimate`, request);
  }

  getAll(page = 0, size = 10) {
    return this.http.get<PageResponse<BookingResponse>>(`${this.base}?page=${page}&size=${size}`);
  }

  getMyBookings(page = 0, size = 10) {
    return this.http.get<PageResponse<BookingResponse>>(`${this.base}/my?page=${page}&size=${size}`);
  }

  getById(id: number) {
    return this.http.get<BookingResponse>(`${this.base}/${id}`);
  }

  confirm(id: number) {
    return this.http.put<BookingResponse>(`${this.base}/${id}/confirm`, {});
  }

  activate(id: number) {
    return this.http.put<BookingResponse>(`${this.base}/${id}/activate`, {});
  }

  complete(id: number) {
    return this.http.put<BookingResponse>(`${this.base}/${id}/complete`, {});
  }

  cancel(id: number, reason?: string) {
    const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
    return this.http.put<BookingResponse>(`${this.base}/${id}/cancel${params}`, {});
  }
}
