export type MissionStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface MissionResponse {
  id: number;
  contractId: number;
  truckLicensePlate: string;
  driverName?: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate?: string;
  status: MissionStatus;
  notes?: string;
}

export interface MissionRequest {
  contractId: number;
  origin: string;
  destination: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}