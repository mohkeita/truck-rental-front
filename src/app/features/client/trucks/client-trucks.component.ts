import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse } from '../../../core/models/truck.model';

@Component({
  selector: 'app-client-trucks',
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Available Trucks</h1>
        <p class="text-gray-500 text-sm mt-1">{{ trucks().length }} trucks ready for rental</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (truck of trucks(); track truck.id) {
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div class="text-3xl">🚛</div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Available
              </span>
            </div>

            <h3 class="font-bold text-lg text-gray-900">{{ truck.brand }} {{ truck.model }}</h3>
            <p class="font-mono text-sm text-gray-500 mb-3">{{ truck.licensePlate }}</p>

            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <div class="flex items-center gap-1">
                <span>⚖️</span>
                <span>{{ truck.capacityTons }} tons</span>
              </div>
              <div class="flex items-center gap-1">
                <span>📅</span>
                <span>{{ truck.year }}</span>
              </div>
            </div>

            <button
              (click)="rentTruck(truck)"
              class="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm">
              Rent This Truck
            </button>
          </div>
        } @empty {
          <div class="col-span-3 py-16 text-center text-gray-400">
            <div class="text-4xl mb-3">🚛</div>
            <p class="text-lg font-medium">No trucks available</p>
            <p class="text-sm">Check back soon for available trucks</p>
          </div>
        }
      </div>

      @if (totalPages() > 1) {
        <div class="mt-6 flex items-center justify-center gap-2">
          <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            Previous
          </button>
          <span class="text-sm text-gray-500">Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
          <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            Next
          </button>
        </div>
      }
    </div>
  `,
})
export class ClientTrucksComponent implements OnInit {
  private truckService = inject(TruckService);
  private router = inject(Router);

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
    this.router.navigate(['/client/contracts'], { queryParams: { truckId: truck.id } });
  }
}
