export type DriverStatus = 'AVAILABLE' | 'ON_MISSION' | 'ON_LEAVE' | 'INACTIVE';

export interface DriverResponse {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  email?: string;
  status: DriverStatus;
}

export interface DriverRequest {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  email?: string;
  status?: DriverStatus;
}