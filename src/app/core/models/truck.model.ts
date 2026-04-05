export type TruckStatus =
  | 'PENDING_VALIDATION'
  | 'AVAILABLE'
  | 'ON_MISSION'
  | 'MAINTENANCE'
  | 'OUT_OF_SERVICE'
  | 'REJECTED';

export interface TruckResponse {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  capacityTons: number;
  year: number;
  status: TruckStatus;
  ownerUsername: string;
  rejectionReason?: string;
  pricePerDay?: number;
  transmission?: string;
  fuel?: string;
  airConditioning?: boolean;
  gps?: boolean;
  bluetooth?: boolean;
  cruiseControl?: boolean;
  parkingSensors?: boolean;
  seats?: number;
  featured?: boolean;
  description?: string;
  photoUrls?: string[];
  currency?: string;
  horsepower?: number;
}

export interface TruckRequest {
  licensePlate: string;
  brand: string;
  model: string;
  capacityTons: number;
  year: number;
  pricePerDay?: number;
  transmission?: string;
  fuel?: string;
  airConditioning?: boolean;
  gps?: boolean;
  bluetooth?: boolean;
  cruiseControl?: boolean;
  parkingSensors?: boolean;
  seats?: number;
  description?: string;
  horsepower?: number;
}

export interface RejectRequest {
  reason: string;
}

export interface TruckSearchFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
  maxCapacity?: number;
  transmission?: string;
  fuel?: string;
}
