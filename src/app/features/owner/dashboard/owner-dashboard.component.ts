import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { OwnerStatsResponse } from '../../../core/models/analytics.model';

@Component({
  selector: 'app-owner-dashboard',
  imports: [DecimalPipe],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p class="text-gray-500 text-sm mt-1">Vue d'ensemble des performances de votre flotte</p>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-20">
          <div class="text-gray-400">Chargement des statistiques...</div>
        </div>
      } @else if (stats()) {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-500">Total véhicules</span>
              <span class="text-2xl">🚛</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ stats()!.totalVehicles }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stats()!.activeVehicles }} disponibles</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-500">Total réservations</span>
              <span class="text-2xl">📋</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ stats()!.totalBookings }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ stats()!.monthlyBookings }} ce mois</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-500">Taux d'occupation</span>
              <span class="text-2xl">📊</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ stats()!.occupancyRate | number:'1.1-1' }}%</p>
            <p class="text-xs text-gray-500 mt-1">Réservations actives / véhicules</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-gray-500">Taux de commission</span>
              <span class="text-2xl">💼</span>
            </div>
            <p class="text-3xl font-bold text-gray-900">{{ stats()!.commissionRate }}%</p>
            <p class="text-xs text-gray-500 mt-1">Commission plateforme</p>
          </div>
        </div>

        <!-- Revenue Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Revenus totaux</h3>
            <p class="text-3xl font-bold text-gray-900">{{ stats()!.totalEarnings | number:'1.0-0' }} GNF</p>
            <p class="text-sm text-gray-500 mt-2">Revenus bruts de toutes les réservations</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Revenus nets</h3>
            <p class="text-3xl font-bold text-green-600">{{ stats()!.netEarnings | number:'1.0-0' }} GNF</p>
            <p class="text-sm text-gray-500 mt-2">Après {{ stats()!.commissionRate }}% de commission</p>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2">Revenus mensuels</h3>
            <p class="text-3xl font-bold text-gray-900">{{ stats()!.monthlyEarnings | number:'1.0-0' }} GNF</p>
            <p class="text-sm text-gray-500 mt-2">Brut du mois en cours</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class OwnerDashboardComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  stats = signal<OwnerStatsResponse | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.analyticsService.getOwnerStats().subscribe({
      next: (data) => { this.stats.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); },
    });
  }
}
