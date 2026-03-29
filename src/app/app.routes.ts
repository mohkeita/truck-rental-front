import { Routes } from '@angular/router';
import { adminGuard, ownerGuard, clientGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'trucks',
        loadComponent: () => import('./features/admin/trucks/admin-trucks.component').then(m => m.AdminTrucksComponent),
      },
      {
        path: 'drivers',
        loadComponent: () => import('./features/admin/drivers/admin-drivers.component').then(m => m.AdminDriversComponent),
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/admin/clients/admin-clients.component').then(m => m.AdminClientsComponent),
      },
      {
        path: 'contracts',
        loadComponent: () => import('./features/admin/contracts/admin-contracts.component').then(m => m.AdminContractsComponent),
      },
      {
        path: 'invoices',
        loadComponent: () => import('./features/admin/invoices/admin-invoices.component').then(m => m.AdminInvoicesComponent),
      },
      {
        path: 'missions',
        loadComponent: () => import('./features/admin/missions/admin-missions.component').then(m => m.AdminMissionsComponent),
      },
      { path: '', redirectTo: 'trucks', pathMatch: 'full' },
    ],
  },

  {
    path: 'owner',
    canActivate: [ownerGuard],
    loadComponent: () => import('./features/owner/layout/owner-layout.component').then(m => m.OwnerLayoutComponent),
    children: [
      {
        path: 'trucks',
        loadComponent: () => import('./features/owner/trucks/owner-trucks.component').then(m => m.OwnerTrucksComponent),
      },
      { path: '', redirectTo: 'trucks', pathMatch: 'full' },
    ],
  },

  {
    path: 'client',
    canActivate: [clientGuard],
    loadComponent: () => import('./features/client/layout/client-layout.component').then(m => m.ClientLayoutComponent),
    children: [
      {
        path: 'trucks',
        loadComponent: () => import('./features/client/trucks/client-trucks.component').then(m => m.ClientTrucksComponent),
      },
      {
        path: 'contracts',
        loadComponent: () => import('./features/client/contracts/client-contracts.component').then(m => m.ClientContractsComponent),
      },
      { path: '', redirectTo: 'trucks', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '/auth/login' },
];
