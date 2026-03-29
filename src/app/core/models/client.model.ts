export interface ClientResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface ClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
}