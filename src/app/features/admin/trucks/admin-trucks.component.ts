import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse, TruckRequest } from '../../../core/models/truck.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-trucks',
  imports: [FormsModule, StatusBadgeComponent],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Trucks Management</h1>
        <button (click)="openAddModal()"
          class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <span>+</span> Add Truck
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">License Plate</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Brand / Model</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Capacity</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Year</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Owner</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (truck of trucks(); track truck.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 font-mono text-sm font-semibold">{{ truck.licensePlate }}</td>
                  <td class="px-4 py-3">
                    <div class="font-medium">{{ truck.brand }}</div>
                    <div class="text-sm text-gray-500">{{ truck.model }}</div>
                  </td>
                  <td class="px-4 py-3 text-sm">{{ truck.capacityTons }} t</td>
                  <td class="px-4 py-3 text-sm">{{ truck.year }}</td>
                  <td class="px-4 py-3 text-sm text-gray-600">{{ truck.ownerUsername }}</td>
                  <td class="px-4 py-3">
                    <app-status-badge [status]="truck.status" />
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-2">
                      @if (truck.status === 'PENDING_VALIDATION') {
                        <button (click)="approve(truck)"
                          class="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium transition-colors">
                          ✓ Approve
                        </button>
                        <button (click)="openRejectModal(truck)"
                          class="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium transition-colors">
                          ✗ Reject
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-4 py-12 text-center text-gray-400">No trucks found</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <span class="text-sm text-gray-500">Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
            <div class="flex gap-2">
              <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50">
                Previous
              </button>
              <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Reject Modal -->
    @if (showRejectModal()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
          <h3 class="text-lg font-bold mb-4">Reject Truck — {{ selectedTruck()?.licensePlate }}</h3>
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason for rejection</label>
          <textarea
            [(ngModel)]="rejectReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            placeholder="Explain why this truck is being rejected..."
          ></textarea>
          <div class="flex gap-3 mt-4">
            <button (click)="confirmReject()"
              [disabled]="!rejectReason.trim()"
              class="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg font-medium transition-colors">
              Confirm Rejection
            </button>
            <button (click)="showRejectModal.set(false)"
              class="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Add Truck Modal -->
    @if (showAddModal()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
          <h3 class="text-lg font-bold mb-4">Add New Truck</h3>
          <form (ngSubmit)="submitAdd()" #addForm="ngForm">
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">License Plate</label>
                <input type="text" name="licensePlate" [(ngModel)]="newTruck.licensePlate" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Brand</label>
                <input type="text" name="brand" [(ngModel)]="newTruck.brand" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Model</label>
                <input type="text" name="model" [(ngModel)]="newTruck.model" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Capacity (tons)</label>
                <input type="number" name="capacityTons" [(ngModel)]="newTruck.capacityTons" required min="0.5"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Year</label>
                <input type="number" name="year" [(ngModel)]="newTruck.year" required min="1990" max="2030"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div class="flex gap-3 mt-4">
              <button type="submit" [disabled]="!addForm.form.valid"
                class="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium transition-colors">
                Add Truck
              </button>
              <button type="button" (click)="showAddModal.set(false)"
                class="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class AdminTrucksComponent implements OnInit {
  private truckService = inject(TruckService);

  trucks = signal<TruckResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  showRejectModal = signal(false);
  showAddModal = signal(false);
  selectedTruck = signal<TruckResponse | null>(null);
  rejectReason = '';
  newTruck: TruckRequest = { licensePlate: '', brand: '', model: '', capacityTons: 5, year: new Date().getFullYear() };

  ngOnInit(): void {
    this.loadTrucks();
  }

  loadTrucks(): void {
    this.truckService.getAll(this.currentPage(), 10).subscribe({
      next: page => {
        this.trucks.set(page.content);
        this.totalPages.set(page.totalPages);
      },
    });
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadTrucks();
  }

  approve(truck: TruckResponse): void {
    this.truckService.approve(truck.id).subscribe({ next: () => this.loadTrucks() });
  }

  openRejectModal(truck: TruckResponse): void {
    this.selectedTruck.set(truck);
    this.rejectReason = '';
    this.showRejectModal.set(true);
  }

  confirmReject(): void {
    const truck = this.selectedTruck();
    if (!truck || !this.rejectReason.trim()) return;
    this.truckService.reject(truck.id, { reason: this.rejectReason }).subscribe({
      next: () => {
        this.showRejectModal.set(false);
        this.loadTrucks();
      },
    });
  }

  openAddModal(): void {
    this.newTruck = { licensePlate: '', brand: '', model: '', capacityTons: 5, year: new Date().getFullYear() };
    this.showAddModal.set(true);
  }

  submitAdd(): void {
    this.truckService.create(this.newTruck).subscribe({
      next: () => {
        this.showAddModal.set(false);
        this.loadTrucks();
      },
    });
  }
}
