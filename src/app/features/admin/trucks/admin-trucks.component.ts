import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse, TruckRequest } from '../../../core/models/truck.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-trucks',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent],
  template: `
    <div class="animate-fade-in">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-heading font-bold text-gradient uppercase">Trucks</h1>
          <p class="text-muted-foreground text-sm mt-1">Manage the truck fleet</p>
        </div>
        <button (click)="openAddModal()"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium font-heading uppercase tracking-wide hover:bg-primary/90 transition-colors">
          <span>+</span> Add Truck
        </button>
      </div>

      <!-- Table -->
      <div class="glass-card rounded-xl overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">License Plate</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Brand / Model</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Capacity</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Year</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Owner</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Status</th>
              <th class="text-right p-4 text-sm text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (truck of trucks(); track truck.id) {
              <tr class="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td class="p-4 text-foreground font-medium text-sm">{{ truck.licensePlate }}</td>
                <td class="p-4 text-foreground text-sm">{{ truck.brand }} {{ truck.model }}</td>
                <td class="p-4 text-foreground text-sm">{{ truck.capacityTons }}t</td>
                <td class="p-4 text-foreground text-sm">{{ truck.year }}</td>
                <td class="p-4 text-muted-foreground text-sm">{{ truck.ownerUsername }}</td>
                <td class="p-4">
                  <app-status-badge [status]="truck.status" />
                </td>
                <td class="p-4">
                  <div class="flex items-center justify-end gap-1">
                    @if (truck.status === 'PENDING_VALIDATION') {
                      <button (click)="approve(truck)"
                        class="h-8 px-3 rounded-md bg-success/20 text-success border border-success/30 text-xs font-medium hover:bg-success/30 transition-colors">
                        ✓ Approve
                      </button>
                      <button (click)="openRejectModal(truck)"
                        class="h-8 px-3 rounded-md bg-destructive/20 text-destructive border border-destructive/30 text-xs font-medium hover:bg-destructive/30 transition-colors">
                        ✗ Reject
                      </button>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="p-8 text-center text-muted-foreground text-sm">No trucks found</td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="flex items-center justify-between p-4 border-t border-border">
            <span class="text-sm text-muted-foreground">Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
            <div class="flex gap-2">
              <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                class="px-3 py-1.5 rounded-md bg-secondary text-foreground text-sm disabled:opacity-40 hover:bg-muted transition-colors">
                ← Prev
              </button>
              <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1.5 rounded-md bg-secondary text-foreground text-sm disabled:opacity-40 hover:bg-muted transition-colors">
                Next →
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Reject Modal -->
      @if (showRejectModal()) {
        <div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" (click)="showRejectModal.set(false)">
          <div class="glass-card rounded-xl p-6 w-full max-w-md" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-heading font-bold text-foreground uppercase mb-1">Reject Truck</h3>
            <p class="text-sm text-muted-foreground mb-4">Provide a reason for rejecting <strong class="text-foreground">{{ selectedTruck()?.licensePlate }}</strong></p>
            <textarea [(ngModel)]="rejectReason" rows="3" placeholder="Reason for rejection..."
              class="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-4"></textarea>
            <div class="flex gap-3 justify-end">
              <button (click)="showRejectModal.set(false)"
                class="px-4 py-2 rounded-md border border-border text-foreground text-sm hover:bg-muted transition-colors">Cancel</button>
              <button (click)="confirmReject()" [disabled]="!rejectReason.trim()"
                class="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition-colors">
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Add Truck Modal -->
      @if (showAddModal()) {
        <div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" (click)="showAddModal.set(false)">
          <div class="glass-card rounded-xl p-6 w-full max-w-md" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-heading font-bold text-foreground uppercase mb-4">Add Truck</h3>
            <form (ngSubmit)="submitAdd()" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-muted-foreground mb-1">License Plate</label>
                <input [(ngModel)]="newTruck.licensePlate" name="licensePlate" required
                  class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Brand</label>
                  <input [(ngModel)]="newTruck.brand" name="brand" required
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Model</label>
                  <input [(ngModel)]="newTruck.model" name="model" required
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Capacity (tons)</label>
                  <input type="number" [(ngModel)]="newTruck.capacityTons" name="capacityTons" required
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Year</label>
                  <input type="number" [(ngModel)]="newTruck.year" name="year" required
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div class="flex gap-3 justify-end pt-2">
                <button type="button" (click)="showAddModal.set(false)"
                  class="px-4 py-2 rounded-md border border-border text-foreground text-sm hover:bg-muted transition-colors">Cancel</button>
                <button type="submit"
                  class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Add Truck
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminTrucksComponent implements OnInit {
  trucks = signal<TruckResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  showRejectModal = signal(false);
  showAddModal = signal(false);
  selectedTruck = signal<TruckResponse | null>(null);
  rejectReason = '';
  newTruck: TruckRequest = { licensePlate: '', brand: '', model: '', capacityTons: 0, year: new Date().getFullYear() };

  constructor(private truckService: TruckService) {}

  ngOnInit() { this.loadTrucks(); }

  loadTrucks() {
    this.truckService.getAll(this.currentPage(), 10).subscribe({
      next: (page) => { this.trucks.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number) { this.currentPage.set(page); this.loadTrucks(); }

  approve(truck: TruckResponse) {
    this.truckService.approve(truck.id).subscribe({ next: () => this.loadTrucks() });
  }

  openRejectModal(truck: TruckResponse) {
    this.selectedTruck.set(truck);
    this.rejectReason = '';
    this.showRejectModal.set(true);
  }

  confirmReject() {
    const truck = this.selectedTruck();
    if (!truck) return;
    this.truckService.reject(truck.id, { reason: this.rejectReason }).subscribe({
      next: () => { this.showRejectModal.set(false); this.loadTrucks(); },
    });
  }

  openAddModal() {
    this.newTruck = { licensePlate: '', brand: '', model: '', capacityTons: 0, year: new Date().getFullYear() };
    this.showAddModal.set(true);
  }

  submitAdd() {
    this.truckService.create(this.newTruck).subscribe({
      next: () => { this.showAddModal.set(false); this.loadTrucks(); },
    });
  }
}
