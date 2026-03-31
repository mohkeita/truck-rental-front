import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse } from '../../../core/models/truck.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-public-trucks',
  imports: [RouterLink, DecimalPipe, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div class="mb-8">
        <h1 class="text-3xl font-heading font-bold text-foreground">Camions disponibles</h1>
        @if (filteredTrucks().length > 0) {
          <p class="text-muted-foreground mt-1">{{ filteredTrucks().length }} camions prêts à la location</p>
        }
      </div>

      @if (loadError()) {
        <div class="glass-card rounded-xl p-12 text-center">
          <div class="text-4xl mb-4">&#128274;</div>
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
        <!-- Filters -->
        <div class="glass-card rounded-xl p-4 mb-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <!-- Search -->
            <div>
              <input type="text" placeholder="Rechercher marque, modèle..."
                [ngModel]="search()" (ngModelChange)="search.set($event)"
                class="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>

            <!-- Transmission -->
            <div>
              <select [ngModel]="filterTransmission()" (ngModelChange)="filterTransmission.set($event)"
                class="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Toutes les transmissions</option>
                @for (t of transmissionOptions(); track t) {
                  <option [value]="t">{{ t }}</option>
                }
              </select>
            </div>

            <!-- Fuel -->
            <div>
              <select [ngModel]="filterFuel()" (ngModelChange)="filterFuel.set($event)"
                class="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Tous les carburants</option>
                @for (f of fuelOptions(); track f) {
                  <option [value]="f">{{ f }}</option>
                }
              </select>
            </div>

            <!-- Reset -->
            <div class="flex items-center">
              @if (hasActiveFilters()) {
                <button (click)="resetFilters()"
                  class="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  Effacer les filtres
                </button>
              }
            </div>
          </div>

          <!-- Feature toggles -->
          <div class="flex flex-wrap gap-2 mt-3">
            <button (click)="toggleFeature('gps')"
              [class]="featureClass(filterGps())">
              GPS
            </button>
            <button (click)="toggleFeature('bluetooth')"
              [class]="featureClass(filterBluetooth())">
              Bluetooth
            </button>
            <button (click)="toggleFeature('ac')"
              [class]="featureClass(filterAC())">
              A/C
            </button>
            <button (click)="toggleFeature('cruise')"
              [class]="featureClass(filterCruise())">
              Régulateur de vitesse
            </button>
            <button (click)="toggleFeature('sensors')"
              [class]="featureClass(filterSensors())">
              Capteurs de stationnement
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (truck of filteredTrucks(); track truck.id) {
            <a [routerLink]="['/trucks', truck.id]" class="glass-card rounded-xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer">
              <div class="relative h-44 w-full">
                @if (truck.photoUrls?.length) {
                  <img [src]="apiUrl + truck.photoUrls![0]" [alt]="truck.brand + ' ' + truck.model"
                    class="h-full w-full object-cover" />
                } @else {
                  <div class="h-full w-full bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
                    <svg class="w-16 h-16 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5" />
                      <path d="M15 7v4h5" />
                    </svg>
                  </div>
                }
                <span class="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/90 text-white backdrop-blur-sm">
                  Disponible
                </span>
              </div>
              <div class="p-5">
              <h3 class="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{{ truck.brand }} {{ truck.model }}</h3>
              <p class="text-sm text-muted-foreground mb-3">{{ truck.licensePlate }}</p>

              @if (truck.pricePerDay) {
                <p class="text-xl font-bold text-primary mb-3">{{ truck.pricePerDay | number:'1.0-0' }} GNF<span class="text-sm font-normal text-muted-foreground">/jour</span></p>
              }

              <div class="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                <div class="flex items-center gap-1">
                  <span>&#9878;&#65039;</span><span>{{ truck.capacityTons }}t</span>
                </div>
                <div class="flex items-center gap-1">
                  <span>&#128197;</span><span>{{ truck.year }}</span>
                </div>
                @if (truck.horsepower) {
                  <div class="flex items-center gap-1">
                    <span>&#9889;</span><span>{{ truck.horsepower }} ch</span>
                  </div>
                }
              </div>

              <div class="flex flex-wrap gap-1.5">
                @if (truck.gps) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">GPS</span> }
                @if (truck.bluetooth) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">Bluetooth</span> }
                @if (truck.airConditioning) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">A/C</span> }
                @if (truck.cruiseControl) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">Cruise</span> }
                @if (truck.parkingSensors) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">Sensors</span> }
              </div>
              </div>
            </a>
          } @empty {
            @if (!loadError()) {
              <div class="col-span-3 py-16 text-center">
                @if (allTrucks().length === 0) {
                  <div class="text-4xl mb-3">&#128667;</div>
                  <p class="text-lg font-medium text-foreground">Chargement des camions...</p>
                } @else {
                  <div class="text-4xl mb-3">&#128269;</div>
                  <p class="text-lg font-medium text-foreground">Aucun camion ne correspond à vos filtres</p>
                  <p class="text-sm text-muted-foreground mt-1">Essayez de modifier vos critères de recherche</p>
                }
              </div>
            }
          }
        </div>

        @if (totalPages() > 1) {
          <div class="mt-8 flex items-center justify-center gap-2">
            <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
              class="px-4 py-2 glass-card rounded-lg text-sm disabled:opacity-40 hover:border-primary/50 text-foreground transition-all">
              Précédent
            </button>
            <span class="text-sm text-muted-foreground">Page {{ currentPage() + 1 }} sur {{ totalPages() }}</span>
            <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
              class="px-4 py-2 glass-card rounded-lg text-sm disabled:opacity-40 hover:border-primary/50 text-foreground transition-all">
              Suivant
            </button>
          </div>
        }
      }
    </div>
  `,
})
export class PublicTrucksComponent implements OnInit {
  private truckService = inject(TruckService);
  private authService = inject(AuthService);
  apiUrl = environment.apiUrl;

  allTrucks = signal<TruckResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  loadError = signal(false);

  // Filters
  search = signal('');
  filterTransmission = signal('');
  filterFuel = signal('');
  filterGps = signal(false);
  filterBluetooth = signal(false);
  filterAC = signal(false);
  filterCruise = signal(false);
  filterSensors = signal(false);

  // Derive unique options from loaded data
  transmissionOptions = computed(() => {
    const values = this.allTrucks().map(t => t.transmission).filter((v): v is string => !!v);
    return [...new Set(values)].sort();
  });

  fuelOptions = computed(() => {
    const values = this.allTrucks().map(t => t.fuel).filter((v): v is string => !!v);
    return [...new Set(values)].sort();
  });

  hasActiveFilters = computed(() =>
    this.search() !== '' || this.filterTransmission() !== '' || this.filterFuel() !== '' ||
    this.filterGps() || this.filterBluetooth() || this.filterAC() || this.filterCruise() || this.filterSensors()
  );

  filteredTrucks = computed(() => {
    let trucks = this.allTrucks();
    const q = this.search().toLowerCase();
    if (q) {
      trucks = trucks.filter(t =>
        t.brand.toLowerCase().includes(q) ||
        t.model.toLowerCase().includes(q) ||
        t.licensePlate.toLowerCase().includes(q)
      );
    }
    const trans = this.filterTransmission();
    if (trans) {
      trucks = trucks.filter(t => t.transmission === trans);
    }
    const fuel = this.filterFuel();
    if (fuel) {
      trucks = trucks.filter(t => t.fuel === fuel);
    }
    if (this.filterGps()) trucks = trucks.filter(t => t.gps);
    if (this.filterBluetooth()) trucks = trucks.filter(t => t.bluetooth);
    if (this.filterAC()) trucks = trucks.filter(t => t.airConditioning);
    if (this.filterCruise()) trucks = trucks.filter(t => t.cruiseControl);
    if (this.filterSensors()) trucks = trucks.filter(t => t.parkingSensors);
    return trucks;
  });

  trucks = this.filteredTrucks;

  ngOnInit() { this.load(); }

  load() {
    this.truckService.getAvailable(this.currentPage(), 9).subscribe({
      next: page => { this.allTrucks.set(page.content); this.totalPages.set(page.totalPages); },
      error: () => this.loadError.set(true),
    });
  }

  changePage(page: number) { this.currentPage.set(page); this.load(); }

  toggleFeature(feature: string) {
    switch (feature) {
      case 'gps': this.filterGps.set(!this.filterGps()); break;
      case 'bluetooth': this.filterBluetooth.set(!this.filterBluetooth()); break;
      case 'ac': this.filterAC.set(!this.filterAC()); break;
      case 'cruise': this.filterCruise.set(!this.filterCruise()); break;
      case 'sensors': this.filterSensors.set(!this.filterSensors()); break;
    }
  }

  featureClass(active: boolean): string {
    return active
      ? 'px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground transition-colors'
      : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors';
  }

  resetFilters() {
    this.search.set('');
    this.filterTransmission.set('');
    this.filterFuel.set('');
    this.filterGps.set(false);
    this.filterBluetooth.set(false);
    this.filterAC.set(false);
    this.filterCruise.set(false);
    this.filterSensors.set(false);
  }

  login() { this.authService.login(); }
  register() { this.authService.register(); }
}
