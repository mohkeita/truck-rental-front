export interface AdminStatsResponse {
  totalTrucks: number;
  availableTrucks: number;
  totalBookings: number;
  activeBookings: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingSubmissions: number;
}

export interface OwnerStatsResponse {
  totalVehicles: number;
  activeVehicles: number;
  totalBookings: number;
  monthlyBookings: number;
  occupancyRate: number;
  totalEarnings: number;
  monthlyEarnings: number;
  commissionRate: number;
  netEarnings: number;
}
