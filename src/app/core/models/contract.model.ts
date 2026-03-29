export type ContractStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface ContractResponse {
  id: number;
  truckId: number;
  truckLicensePlate: string;
  truckBrand: string;
  clientUsername: string;
  driverId?: number;
  driverName?: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalCost: number;
  status: ContractStatus;
  notes?: string;
}

export interface ContractRequest {
  truckId: number;
  driverId?: number;
  startDate: string;
  endDate: string;
  dailyRate: number;
  notes?: string;
}