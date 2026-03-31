import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse } from '../../../core/models/truck.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-trucks',
  imports: [DecimalPipe],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Camions disponibles</h1>
        <p class="text-gray-500 text-sm mt-1">{{ trucks().length }} camions prêts à la location</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (truck of trucks(); track truck.id) {
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="relative h-40 w-full">
              @if (truck.photoUrls?.length) {
                <img [src]="apiUrl + truck.photoUrls![0]" [alt]="truck.brand + ' ' + truck.model"
                  class="h-full w-full object-cover" />
              } @else {
                <div class="h-full w-full bg-gradient-to-br from-orange-50 via-gray-100 to-orange-50 flex items-center justify-center">
                  <svg class="w-14 h-14 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5" />
                    <path d="M15 7v4h5" />
                  </svg>
                </div>
              }
              <span class="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                Disponible
              </span>
            </div>
            <div class="p-5">
            <h3 class="font-bold text-lg text-gray-900">{{ truck.brand }} {{ truck.model }}</h3>
            <p class="font-mono text-sm text-gray-500 mb-3">{{ truck.licensePlate }}</p>

            @if (truck.pricePerDay) {
              <p class="text-xl font-bold text-orange-500 mb-3">{{ truck.pricePerDay | number:'1.0-0' }} GNF<span class="text-sm font-normal text-gray-400">/jour</span></p>
            }

            <div class="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
              <div class="flex items-center gap-1">
                <span>&#9878;&#65039;</span>
                <span>{{ truck.capacityTons }}t</span>
              </div>
              <div class="flex items-center gap-1">
                <span>&#128197;</span>
                <span>{{ truck.year }}</span>
              </div>
              @if (truck.horsepower) {
                <div class="flex items-center gap-1">
                  <span>&#9889;</span>
                  <span>{{ truck.horsepower }} ch</span>
                </div>
              }
            </div>

            <div class="flex flex-wrap gap-1.5 mb-4">
              @if (truck.gps) { <span class="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">GPS</span> }
              @if (truck.bluetooth) { <span class="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">Bluetooth</span> }
              @if (truck.airConditioning) { <span class="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">A/C</span> }
              @if (truck.cruiseControl) { <span class="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">Cruise</span> }
              @if (truck.parkingSensors) { <span class="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">Sensors</span> }
            </div>

            <button
              (click)="rentTruck(truck)"
              class="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm">
              Louer ce camion
            </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-3 py-16 text-center text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5" />
              <path d="M15 7v4h5" />
            </svg>
            <p class="text-lg font-medium">Aucun camion disponible</p>
            <p class="text-sm">Revenez bientôt pour voir les camions disponibles</p>
          </div>
        }
      </div>

      @if (totalPages() > 1) {
        <div class="mt-6 flex items-center justify-center gap-2">
          <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            Précédent
          </button>
          <span class="text-sm text-gray-500">Page {{ currentPage() + 1 }} sur {{ totalPages() }}</span>
          <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            Suivant
          </button>
        </div>
      }
    </div>
  `,
})
export class ClientTrucksComponent implements OnInit {
  private truckService = inject(TruckService);
  private router = inject(Router);
  apiUrl = environment.apiUrl;

  trucks = signal<TruckResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.truckService.getAvailable(this.currentPage(), 12).subscribe({
      next: page => { this.trucks.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number): void { this.currentPage.set(page); this.load(); }

  rentTruck(truck: TruckResponse): void {
    this.router.navigate(['/client/book'], { queryParams: { truckId: truck.id } });
  }
}
