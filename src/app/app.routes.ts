import { Routes } from '@angular/router';
import { adminGuard, ownerGuard, clientGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'trucks',
    loadComponent: () => import('./features/public/trucks/public-trucks.component').then(m => m.PublicTrucksComponent),
  },
  {
    path: 'trucks/:id',
    loadComponent: () => import('./features/public/trucks/truck-detail.component').then(m => m.TruckDetailComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent),
  },

  // Admin (protected)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'trucks',
        loadComponent: () => import('./features/admin/trucks/admin-trucks.component').then(m => m.AdminTrucksComponent),
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/admin/bookings/admin-bookings.component').then(m => m.AdminBookingsComponent),
      },
      {
        path: 'locations',
        loadComponent: () => import('./features/admin/locations/admin-locations.component').then(m => m.AdminLocationsComponent),
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
        path: 'users',
        loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent),
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
      {
        path: 'messages',
        loadComponent: () => import('./features/admin/messages/admin-messages.component').then(m => m.AdminMessagesComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Owner (protected)
  {
    path: 'owner',
    canActivate: [ownerGuard],
    loadComponent: () => import('./features/owner/layout/owner-layout.component').then(m => m.OwnerLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/owner/dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent),
      },
      {
        path: 'trucks',
        loadComponent: () => import('./features/owner/trucks/owner-trucks.component').then(m => m.OwnerTrucksComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Client (protected)
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
        path: 'book',
        loadComponent: () => import('./features/client/bookings/create-booking.component').then(m => m.CreateBookingComponent),
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/client/bookings/my-bookings.component').then(m => m.MyBookingsComponent),
      },
      {
        path: 'payment-result',
        loadComponent: () => import('./features/client/bookings/payment-result.component').then(m => m.PaymentResultComponent),
      },
      {
        path: 'contracts',
        loadComponent: () => import('./features/client/contracts/client-contracts.component').then(m => m.ClientContractsComponent),
      },
      { path: '', redirectTo: 'trucks', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '/' },
];
