export interface PaymentInitResponse {
  transactionId: string;
  paymentUrl: string;
}

export type PaymentStatus = 'INITIATED' | 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

export interface PaymentStatusResponse {
  transactionId: string;
  status: PaymentStatus;
  paymentMethod: string;
  bookingId: number;
  bookingStatus: string;
}
