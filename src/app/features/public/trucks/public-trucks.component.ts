import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse, TruckSearchFilters } from '../../../core/models/truck.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-public-trucks',
  imports: [RouterLink, DecimalPipe, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <a routerLink="/" class="hover:text-foreground transition-colors">Accueil</a>
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        <span class="text-foreground">Catalogue</span>
      </nav>

      <!-- Header -->
      <div class="mb-8">
        <span class="badge-label">Notre flotte</span>
        <h1 class="section-title mt-4">CATALOGUE <span class="text-primary">CAMIONS</span></h1>
        @if (filteredTrucks().length > 0) {
          <p class="text-muted-foreground mt-2">{{ filteredTrucks().length }} camions disponibles</p>
        }
      </div>

      @if (loadError()) {
        <div class="glass-card rounded-xl p-12 text-center">
          <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-foreground mb-2">Connectez-vous pour voir les camions</h3>
          <p class="text-sm text-muted-foreground mb-4">Cr&eacute;ez un compte gratuit pour d&eacute;couvrir notre flotte</p>
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
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Sidebar Filters -->
          <div class="lg:w-72 shrink-0">
            <!-- Mobile toggle -->
            <button (click)="filtersOpen.set(!filtersOpen())" class="lg:hidden w-full flex items-center justify-between px-4 py-3 glass-card rounded-xl mb-4 text-sm font-medium text-foreground">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filtres
              </span>
              <svg class="w-4 h-4 transition-transform" [class.rotate-180]="filtersOpen()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            <div [class.hidden]="!filtersOpen()" class="lg:!block">
              <div class="glass-card rounded-xl p-5 space-y-5">
                <!-- Search -->
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Recherche</label>
                  <input type="text" placeholder="Marque, mod&egrave;le..."
                    [ngModel]="search()" (ngModelChange)="search.set($event)"
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>

                <!-- Transmission -->
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Transmission</label>
                  <select [ngModel]="filterTransmission()" (ngModelChange)="filterTransmission.set($event)"
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Toutes</option>
                    @for (t of transmissionOptions(); track t) {
                      <option [value]="t">{{ t }}</option>
                    }
                  </select>
                </div>

                <!-- Fuel -->
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Carburant</label>
                  <select [ngModel]="filterFuel()" (ngModelChange)="filterFuel.set($event)"
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Tous</option>
                    @for (f of fuelOptions(); track f) {
                      <option [value]="f">{{ f }}</option>
                    }
                  </select>
                </div>

                <!-- Price range -->
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Prix (GNF/jour)</label>
                  <div class="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Min"
                      [ngModel]="filterMinPrice()" (ngModelChange)="filterMinPrice.set($event)"
                      class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input type="number" placeholder="Max"
                      [ngModel]="filterMaxPrice()" (ngModelChange)="filterMaxPrice.set($event)"
                      class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>

                <!-- Capacity -->
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">Capacit&eacute; (tonnes)</label>
                  <div class="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Min"
                      [ngModel]="filterMinCapacity()" (ngModelChange)="filterMinCapacity.set($event)"
                      class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input type="number" placeholder="Max"
                      [ngModel]="filterMaxCapacity()" (ngModelChange)="filterMaxCapacity.set($event)"
                      class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>

                <!-- Features -->
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">&Eacute;quipements</label>
                  <div class="flex flex-wrap gap-2">
                    <button (click)="toggleFeature('gps')" [class]="featureClass(filterGps())">GPS</button>
                    <button (click)="toggleFeature('bluetooth')" [class]="featureClass(filterBluetooth())">Bluetooth</button>
                    <button (click)="toggleFeature('ac')" [class]="featureClass(filterAC())">A/C</button>
                    <button (click)="toggleFeature('cruise')" [class]="featureClass(filterCruise())">R&eacute;gulateur</button>
                    <button (click)="toggleFeature('sensors')" [class]="featureClass(filterSensors())">Capteurs</button>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col gap-2 pt-2">
                  <button (click)="applyServerFilters()"
                    class="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    Rechercher
                  </button>
                  @if (hasActiveFilters()) {
                    <button (click)="resetFilters()"
                      class="w-full py-2.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      Effacer les filtres
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Trucks Grid -->
          <div class="flex-1 min-w-0">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (truck of filteredTrucks(); track truck.id) {
                <a [routerLink]="['/trucks', truck.id]" class="glass-card rounded-xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer">
                  <div class="relative h-48 w-full overflow-hidden">
                    @if (truck.photoUrls?.length) {
                      <img [src]="apiUrl + truck.photoUrls![0]" [alt]="truck.brand + ' ' + truck.model"
                        class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    } @else {
                      <div class="h-full w-full bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
                        <svg class="w-16 h-16 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5"/>
                          <path d="M15 7v4h5"/>
                        </svg>
                      </div>
                    }
                    <span class="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/90 text-white backdrop-blur-sm">
                      Disponible
                    </span>
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span class="text-white font-bold text-lg font-heading">{{ truck.brand }}</span>
                    </div>
                  </div>
                  <div class="p-5">
                    <h3 class="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{{ truck.brand }} {{ truck.model }}</h3>

                    @if (truck.pricePerDay) {
                      <p class="text-xl font-bold text-primary mt-1">{{ truck.pricePerDay | number:'1.0-0' }} GNF<span class="text-sm font-normal text-muted-foreground">/jour</span></p>
                    }

                    <div class="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                        <span>{{ truck.capacityTons }}t</span>
                      </div>
                      @if (truck.fuel) {
                        <div class="flex items-center gap-1.5">
                          <svg class="w-4 h-4 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22V6l7-4 7 4v16"/><path d="M10 2v4"/><path d="M17 6l4 2v8l-4 2"/></svg>
                          <span>{{ truck.fuel }}</span>
                        </div>
                      }
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>{{ truck.year }}</span>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-1.5 mt-3">
                      @if (truck.gps) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">GPS</span> }
                      @if (truck.bluetooth) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">Bluetooth</span> }
                      @if (truck.airConditioning) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">A/C</span> }
                      @if (truck.cruiseControl) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">Cruise</span> }
                      @if (truck.parkingSensors) { <span class="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">Sensors</span> }
                    </div>

                    <div class="mt-4 pt-4 border-t border-border">
                      <span class="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Voir d&eacute;tails
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </span>
                    </div>
                  </div>
                </a>
              } @empty {
                @if (!loadError()) {
                  <div class="col-span-full py-16 text-center">
                    @if (allTrucks().length === 0) {
                      <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5"/>
                          <path d="M15 7v4h5"/>
                        </svg>
                      </div>
                      <p class="text-lg font-medium text-foreground">Chargement des camions...</p>
                    } @else {
                      <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      </div>
                      <p class="text-lg font-medium text-foreground">Aucun camion ne correspond &agrave; vos filtres</p>
                      <p class="text-sm text-muted-foreground mt-1">Essayez de modifier vos crit&egrave;res de recherche</p>
                    }
                  </div>
                }
              }
            </div>

            @if (totalPages() > 1) {
              <div class="mt-8 flex items-center justify-center gap-2">
                <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                  class="px-4 py-2 glass-card rounded-lg text-sm disabled:opacity-40 hover:border-primary/50 text-foreground transition-all">
                  Pr&eacute;c&eacute;dent
                </button>
                <span class="text-sm text-muted-foreground px-3">Page {{ currentPage() + 1 }} sur {{ totalPages() }}</span>
                <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                  class="px-4 py-2 glass-card rounded-lg text-sm disabled:opacity-40 hover:border-primary/50 text-foreground transition-all">
                  Suivant
                </button>
              </div>
            }
          </div>
        </div>
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
  filtersOpen = signal(false);

  // Filters
  search = signal('');
  filterTransmission = signal('');
  filterFuel = signal('');
  filterMinPrice = signal<number | null>(null);
  filterMaxPrice = signal<number | null>(null);
  filterMinCapacity = signal<number | null>(null);
  filterMaxCapacity = signal<number | null>(null);
  filterGps = signal(false);
  filterBluetooth = signal(false);
  filterAC = signal(false);
  filterCruise = signal(false);
  filterSensors = signal(false);

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
    this.filterMinPrice() != null || this.filterMaxPrice() != null ||
    this.filterMinCapacity() != null || this.filterMaxCapacity() != null ||
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
    if (trans) trucks = trucks.filter(t => t.transmission === trans);
    const fuel = this.filterFuel();
    if (fuel) trucks = trucks.filter(t => t.fuel === fuel);
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
    const filters: TruckSearchFilters = {};
    const s = this.search();
    if (s) filters.search = s;
    if (this.filterTransmission()) filters.transmission = this.filterTransmission();
    if (this.filterFuel()) filters.fuel = this.filterFuel();
    if (this.filterMinPrice() != null) filters.minPrice = this.filterMinPrice()!;
    if (this.filterMaxPrice() != null) filters.maxPrice = this.filterMaxPrice()!;
    if (this.filterMinCapacity() != null) filters.minCapacity = this.filterMinCapacity()!;
    if (this.filterMaxCapacity() != null) filters.maxCapacity = this.filterMaxCapacity()!;

    const hasServerFilters = Object.keys(filters).length > 0;
    this.truckService.getAvailable(this.currentPage(), 9, hasServerFilters ? filters : undefined).subscribe({
      next: page => { this.allTrucks.set(page.content); this.totalPages.set(page.totalPages); },
      error: () => this.loadError.set(true),
    });
  }

  applyServerFilters() { this.currentPage.set(0); this.load(); }
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
    this.filterMinPrice.set(null);
    this.filterMaxPrice.set(null);
    this.filterMinCapacity.set(null);
    this.filterMaxCapacity.set(null);
    this.filterGps.set(false);
    this.filterBluetooth.set(false);
    this.filterAC.set(false);
    this.filterCruise.set(false);
    this.filterSensors.set(false);
    this.currentPage.set(0);
    this.load();
  }

  login() { this.authService.login(); }
  register() { this.authService.register(); }
}
