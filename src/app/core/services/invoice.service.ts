import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response.model';
import { InvoiceRequest, InvoiceResponse } from '../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/invoices`;

  getAll(page = 0, size = 10) {
    return this.http.get<PageResponse<InvoiceResponse>>(`${this.base}?page=${page}&size=${size}`);
  }

  getById(id: number) {
    return this.http.get<InvoiceResponse>(`${this.base}/${id}`);
  }

  create(invoice: InvoiceRequest) {
    return this.http.post<InvoiceResponse>(this.base, invoice);
  }

  pay(id: number) {
    return this.http.put<InvoiceResponse>(`${this.base}/${id}/pay`, {});
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  downloadPdf(id: number) {
    return this.http.get(`${this.base}/${id}/pdf`, { responseType: 'blob' });
  }
}
