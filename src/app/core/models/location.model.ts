export interface LocationResponse {
  id: number;
  name: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
  active: boolean;
  createdAt: string;
}

export interface LocationRequest {
  name: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  openingHours?: string;
  latitude?: number;
  longitude?: number;
}
