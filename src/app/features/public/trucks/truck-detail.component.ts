import { Component, inject, signal, OnInit, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse } from '../../../core/models/truck.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-truck-detail',
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <a routerLink="/trucks" class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        &larr; Retour aux camions
      </a>

      @if (truck(); as t) {
        <div class="glass-card rounded-xl overflow-hidden">
          <div class="relative h-64 sm:h-80 w-full">
            @if (t.photoUrls?.length) {
              <img [src]="apiUrl + t.photoUrls![0]" [alt]="t.brand + ' ' + t.model"
                class="h-full w-full object-cover" />
            } @else {
              <div class="h-full w-full bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
                <svg class="w-24 h-24 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5" />
                  <path d="M15 7v4h5" />
                </svg>
              </div>
            }
          </div>
          <div class="p-8">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h1 class="text-3xl font-heading font-bold text-foreground">{{ t.brand }} {{ t.model }}</h1>
              <p class="text-muted-foreground">{{ t.licensePlate }}</p>
            </div>
            @if (t.pricePerDay) {
              <div class="sm:text-right">
                <div class="text-3xl font-bold text-primary">{{ t.pricePerDay | number:'1.0-0' }} GNF</div>
                <div class="text-sm text-muted-foreground">par jour</div>
              </div>
            }
          </div>

          @if (t.description) {
            <p class="text-muted-foreground mb-6">{{ t.description }}</p>
          }

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-secondary/50 rounded-lg p-4 text-center">
              <div class="text-2xl mb-1">&#9878;&#65039;</div>
              <div class="text-xs text-muted-foreground">Capacité</div>
              <div class="font-bold text-foreground">{{ t.capacityTons }} tonnes</div>
            </div>
            <div class="bg-secondary/50 rounded-lg p-4 text-center">
              <div class="text-2xl mb-1">&#128197;</div>
              <div class="text-xs text-muted-foreground">Année</div>
              <div class="font-bold text-foreground">{{ t.year }}</div>
            </div>
            @if (t.transmission) {
              <div class="bg-secondary/50 rounded-lg p-4 text-center">
                <div class="text-2xl mb-1">&#9881;&#65039;</div>
                <div class="text-xs text-muted-foreground">Transmission</div>
                <div class="font-bold text-foreground">{{ t.transmission }}</div>
              </div>
            }
            @if (t.fuel) {
              <div class="bg-secondary/50 rounded-lg p-4 text-center">
                <div class="text-2xl mb-1">&#9981;</div>
                <div class="text-xs text-muted-foreground">Carburant</div>
                <div class="font-bold text-foreground">{{ t.fuel }}</div>
              </div>
            }
            @if (t.seats) {
              <div class="bg-secondary/50 rounded-lg p-4 text-center">
                <div class="text-2xl mb-1">&#128186;</div>
                <div class="text-xs text-muted-foreground">Places</div>
                <div class="font-bold text-foreground">{{ t.seats }}</div>
              </div>
            }
            @if (t.horsepower) {
              <div class="bg-secondary/50 rounded-lg p-4 text-center">
                <div class="text-2xl mb-1">&#9889;</div>
                <div class="text-xs text-muted-foreground">Puissance</div>
                <div class="font-bold text-foreground">{{ t.horsepower }} ch</div>
              </div>
            }
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-bold text-foreground mb-3">Équipements</h2>
            <div class="flex flex-wrap gap-2">
              @if (t.gps) { <span class="px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-medium">&#10003; GPS</span> }
              @if (t.bluetooth) { <span class="px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-medium">&#10003; Bluetooth</span> }
              @if (t.airConditioning) { <span class="px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-medium">&#10003; Climatisation</span> }
              @if (t.cruiseControl) { <span class="px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-medium">&#10003; Régulateur de vitesse</span> }
              @if (t.parkingSensors) { <span class="px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-medium">&#10003; Capteurs de stationnement</span> }
              @if (!t.gps && !t.bluetooth && !t.airConditioning && !t.cruiseControl && !t.parkingSensors) {
                <span class="text-sm text-muted-foreground">Aucun équipement supplémentaire</span>
              }
            </div>
          </div>

          <button (click)="rentTruck()"
            class="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors glow-amber">
            Louer ce camion
          </button>
          </div>
        </div>
      } @else if (loadError()) {
        <div class="glass-card rounded-xl p-12 text-center">
          <div class="text-4xl mb-4">&#128546;</div>
          <h2 class="text-lg font-bold text-foreground mb-2">Camion introuvable</h2>
          <p class="text-sm text-muted-foreground mb-4">Ce camion n'est peut-être plus disponible ou vous devez vous connecter</p>
          <div class="flex justify-center gap-3">
            <a routerLink="/trucks" class="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block">
              Voir les camions
            </a>
            @if (!authService.isAuthenticated()) {
              <button (click)="login()" class="px-6 py-2.5 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                Connexion
              </button>
            }
          </div>
        </div>
      } @else {
        <div class="glass-card rounded-xl p-8 animate-pulse">
          <div class="h-10 bg-muted rounded w-8 mb-4"></div>
          <div class="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div class="h-5 bg-muted rounded w-1/4 mb-8"></div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            @for (i of [1,2,3,4]; track i) {
              <div class="h-24 bg-muted rounded-lg"></div>
            }
          </div>
          <div class="h-12 bg-muted rounded-lg"></div>
        </div>
      }
    </div>
  `,
})
export class TruckDetailComponent implements OnInit {
  id = input.required<string>();

  private truckService = inject(TruckService);
  authService = inject(AuthService);
  private router = inject(Router);
  apiUrl = environment.apiUrl;

  truck = signal<TruckResponse | null>(null);
  loadError = signal(false);

  ngOnInit() {
    const numId = parseInt(this.id(), 10);
    if (isNaN(numId)) {
      this.loadError.set(true);
      return;
    }
    this.truckService.getAvailableById(numId).subscribe({
      next: t => this.truck.set(t),
      error: () => this.loadError.set(true),
    });
  }

  rentTruck() {
    const t = this.truck();
    if (!t) return;
    if (!this.authService.isAuthenticated()) {
      this.authService.login(window.location.origin + '/client/book?truckId=' + t.id);
      return;
    }
    this.router.navigate(['/client/book'], { queryParams: { truckId: t.id } });
  }

  login() { this.authService.login(); }
}
