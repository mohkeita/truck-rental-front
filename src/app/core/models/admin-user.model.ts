export type UserRole = 'ADMIN' | 'OWNER' | 'CLIENT';

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean;
  role: UserRole;
  createdTimestamp: number;
}

export interface ChangeRoleRequest {
  role: UserRole;
}

export interface SetEnabledRequest {
  enabled: boolean;
}
