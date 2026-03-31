import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { AdminStatsResponse } from '../../../core/models/analytics.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DecimalPipe],
  template: `
    <div class="animate-fade-in">
      <div class="mb-6">
        <h1 class="text-3xl font-heading font-bold text-gradient uppercase">Tableau de bord</h1>
        <p class="text-muted-foreground text-sm mt-1">Vue d'ensemble de l'activité de la plateforme</p>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-20">
          <div class="text-muted-foreground">Chargement des statistiques...</div>
        </div>
      } @else if (stats()) {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="glass-card rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-muted-foreground">Total camions</span>
              <span class="text-2xl">🚛</span>
            </div>
            <p class="text-3xl font-bold text-foreground">{{ stats()!.totalTrucks }}</p>
            <p class="text-xs text-muted-foreground mt-1">{{ stats()!.availableTrucks }} disponibles</p>
          </div>

          <div class="glass-card rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-muted-foreground">Total réservations</span>
              <span class="text-2xl">📋</span>
            </div>
            <p class="text-3xl font-bold text-foreground">{{ stats()!.totalBookings }}</p>
            <p class="text-xs text-muted-foreground mt-1">{{ stats()!.activeBookings }} actives</p>
          </div>

          <div class="glass-card rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-muted-foreground">Total utilisateurs</span>
              <span class="text-2xl">👥</span>
            </div>
            <p class="text-3xl font-bold text-foreground">{{ stats()!.totalUsers }}</p>
          </div>

          <div class="glass-card rounded-xl p-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-muted-foreground">Soumissions en attente</span>
              <span class="text-2xl">⏳</span>
            </div>
            <p class="text-3xl font-bold text-foreground">{{ stats()!.pendingSubmissions }}</p>
          </div>
        </div>

        <!-- Revenue Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="glass-card rounded-xl p-6">
            <h3 class="text-sm font-medium text-muted-foreground mb-2">Revenus totaux</h3>
            <p class="text-4xl font-bold text-foreground">{{ stats()!.totalRevenue | number:'1.0-0' }} GNF</p>
            <p class="text-sm text-muted-foreground mt-2">Toutes les réservations terminées</p>
          </div>

          <div class="glass-card rounded-xl p-6">
            <h3 class="text-sm font-medium text-muted-foreground mb-2">Revenus mensuels</h3>
            <p class="text-4xl font-bold text-foreground">{{ stats()!.monthlyRevenue | number:'1.0-0' }} GNF</p>
            <p class="text-sm text-muted-foreground mt-2">Mois en cours</p>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  stats = signal<AdminStatsResponse | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.analyticsService.getAdminStats().subscribe({
      next: (data) => { this.stats.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); },
    });
  }
}
