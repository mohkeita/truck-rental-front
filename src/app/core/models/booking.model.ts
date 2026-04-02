export type BookingStatus = 'PENDING' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface ExtraRequest {
  name: string;
  pricePerDay: number;
}

export interface ExtraResponse {
  id: number;
  name: string;
  pricePerDay: number;
}

export interface BookingRequest {
  truckId: number;
  pickupLocationId: number;
  returnLocationId: number;
  pickupDate: string;
  returnDate: string;
  extras?: ExtraRequest[];
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  licenseNumber?: string;
}

export interface BookingResponse {
  id: number;
  bookingReference: string;
  truckId: number;
  truckName: string;
  truckLicensePlate: string;
  pickupLocationName: string;
  returnLocationName: string;
  pickupDate: string;
  returnDate: string;
  basePrice: number;
  extrasPrice: number;
  taxAmount: number;
  totalPrice: number;
  taxRate: number;
  status: BookingStatus;
  cancellationReason?: string;
  extras: ExtraResponse[];
  customerName: string;
  createdAt: string;
}
