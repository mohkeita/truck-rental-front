import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PaymentInitResponse, PaymentStatusResponse } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/payments`;

  initiatePayment(bookingId: number) {
    return this.http.post<PaymentInitResponse>(`${this.base}/initiate`, { bookingId });
  }

  checkStatus(transactionId: string) {
    return this.http.get<PaymentStatusResponse>(`${this.base}/${transactionId}/status`);
  }
}
