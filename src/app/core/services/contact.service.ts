import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ContactRequest, ContactMessageResponse } from '../models/contact.model';
import { PageResponse } from '../models/page-response.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  send(request: ContactRequest) {
    return this.http.post<ContactMessageResponse>(`${this.apiUrl}/api/contact`, request);
  }

  getAll(page = 0, size = 10) {
    return this.http.get<PageResponse<ContactMessageResponse>>(
      `${this.apiUrl}/api/admin/messages?page=${page}&size=${size}`
    );
  }

  getById(id: number) {
    return this.http.get<ContactMessageResponse>(`${this.apiUrl}/api/admin/messages/${id}`);
  }

  markAsRead(id: number) {
    return this.http.put<ContactMessageResponse>(`${this.apiUrl}/api/admin/messages/${id}/read`, {});
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/api/admin/messages/${id}`);
  }
}
