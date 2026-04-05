export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
