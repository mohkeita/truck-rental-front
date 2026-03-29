export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface InvoiceResponse {
  id: number;
  contractId: number;
  clientUsername: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  notes?: string;
}

export interface InvoiceRequest {
  contractId: number;
  amount: number;
  dueDate: string;
  notes?: string;
}