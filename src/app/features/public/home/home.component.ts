import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse } from '../../../core/models/truck.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="animate-fade-in">
      <!-- Hero -->
      <section class="relative py-20 lg:py-32 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="max-w-3xl">
            <h1 class="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Louez le <span class="text-gradient">Camion</span> Parfait pour Chaque Mission
            </h1>
            <p class="text-lg text-muted-foreground mb-8 max-w-xl">
              Parcourez notre flotte de camions de qualité, du véhicule utilitaire au poids lourd. Tarifs transparents, durées flexibles et service fiable.
            </p>
            <div class="flex flex-wrap gap-4">
              <a routerLink="/trucks" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Voir les camions
              </a>
              @if (!authService.isAuthenticated()) {
                <button (click)="register()" class="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                  Créer un compte
                </button>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="py-16 border-y border-border bg-card/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-primary font-heading">200+</div>
              <div class="text-sm text-muted-foreground mt-1">Camions disponibles</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-primary font-heading">50+</div>
              <div class="text-sm text-muted-foreground mt-1">Points de retrait</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-primary font-heading">10K+</div>
              <div class="text-sm text-muted-foreground mt-1">Clients satisfaits</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-primary font-heading">24/7</div>
              <div class="text-sm text-muted-foreground mt-1">Support client</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Trucks -->
      <section class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-10">
            <div>
              <h2 class="text-2xl lg:text-3xl font-heading font-bold text-foreground">Camions en vedette</h2>
              <p class="text-muted-foreground mt-1">Découvrez nos camions les plus populaires</p>
            </div>
            <a routerLink="/trucks" class="text-sm text-primary hover:underline hidden sm:inline">Voir tout &rarr;</a>
          </div>

          @if (trucks().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (truck of trucks(); track truck.id) {
                <a [routerLink]="['/trucks', truck.id]" class="glass-card rounded-xl p-5 hover:border-primary/50 transition-all group cursor-pointer">
                  <div class="flex items-start justify-between mb-4">
                    <div class="text-3xl">🚛</div>
                    @if (truck.pricePerDay) {
                      <span class="text-lg font-bold text-primary">{{ truck.pricePerDay | currency:'GNF':'symbol':'1.0-0' }}<span class="text-xs font-normal text-muted-foreground">/jour</span></span>
                    }
                  </div>
                  <h3 class="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{{ truck.brand }} {{ truck.model }}</h3>
                  <p class="text-sm text-muted-foreground mb-3">{{ truck.licensePlate }}</p>
                  <div class="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span>&#9878;&#65039; {{ truck.capacityTons }}t</span>
                    <span>&#128197; {{ truck.year }}</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    @if (truck.gps) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">GPS</span> }
                    @if (truck.bluetooth) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">Bluetooth</span> }
                    @if (truck.airConditioning) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">A/C</span> }
                    @if (truck.cruiseControl) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">Cruise</span> }
                  </div>
                </a>
              }
            </div>
            <div class="mt-8 text-center sm:hidden">
              <a routerLink="/trucks" class="text-sm text-primary hover:underline">Voir tous les camions &rarr;</a>
            </div>
          } @else if (loadError()) {
            <div class="glass-card rounded-xl p-12 text-center">
              <div class="text-4xl mb-4">🔒</div>
              <h3 class="text-lg font-bold text-foreground mb-2">Connectez-vous pour voir les camions</h3>
              <p class="text-sm text-muted-foreground mb-4">Créez un compte gratuit pour découvrir notre flotte</p>
              <div class="flex justify-center gap-3">
                <button (click)="login()" class="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Connexion
                </button>
                <button (click)="register()" class="px-6 py-2.5 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                  S'inscrire
                </button>
              </div>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (i of [1,2,3]; track i) {
                <div class="glass-card rounded-xl p-5 animate-pulse">
                  <div class="h-8 w-8 bg-muted rounded mb-4"></div>
                  <div class="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div class="h-4 bg-muted rounded w-1/2 mb-3"></div>
                  <div class="h-4 bg-muted rounded w-full"></div>
                </div>
              }
            </div>
          }
        </div>
      </section>

      <!-- How It Works -->
      <section class="py-16 lg:py-24 bg-card/30 border-y border-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <h2 class="text-2xl lg:text-3xl font-heading font-bold text-foreground">Comment ça marche</h2>
            <p class="text-muted-foreground mt-2">Louez un camion en 3 étapes simples</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🔍</span>
              </div>
              <h3 class="font-bold text-foreground mb-2">1. Parcourir et choisir</h3>
              <p class="text-sm text-muted-foreground">Explorez notre flotte et trouvez le camion idéal pour vos besoins</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">📋</span>
              </div>
              <h3 class="font-bold text-foreground mb-2">2. Réserver en ligne</h3>
              <p class="text-sm text-muted-foreground">Choisissez vos dates, le lieu de retrait et les options souhaitées</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🚛</span>
              </div>
              <h3 class="font-bold text-foreground mb-2">3. Récupérer et conduire</h3>
              <p class="text-sm text-muted-foreground">Récupérez votre camion et prenez la route en toute confiance</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-4">Prêt à commencer ?</h2>
          <p class="text-muted-foreground mb-8 max-w-md mx-auto">Rejoignez des milliers de clients satisfaits. Inscrivez-vous gratuitement et commencez à louer dès aujourd'hui.</p>
          <div class="flex flex-wrap justify-center gap-4">
            <a routerLink="/trucks" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Voir les camions
            </a>
            @if (!authService.isAuthenticated()) {
              <button (click)="register()" class="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                Créer un compte gratuit
              </button>
            }
          </div>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private truckService = inject(TruckService);
  authService = inject(AuthService);

  trucks = signal<TruckResponse[]>([]);
  loadError = signal(false);

  ngOnInit() {
    this.truckService.getAvailable(0, 6).subscribe({
      next: page => this.trucks.set(page.content),
      error: () => this.loadError.set(true),
    });
  }

  login() { this.authService.login(); }
  register() { this.authService.register(); }
}
