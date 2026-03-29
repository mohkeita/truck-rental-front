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
}

export interface TruckRequest {
  licensePlate: string;
  brand: string;
  model: string;
  capacityTons: number;
  year: number;
}

export interface RejectRequest {
  reason: string;
}