import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TruckService } from '../../../core/services/truck.service';
import { AuthService } from '../../../core/services/auth.service';
import { TruckResponse, TruckRequest } from '../../../core/models/truck.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

@Component({
  selector: 'app-owner-trucks',
  imports: [FormsModule, StatusBadgeComponent],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mes camions</h1>
          <p class="text-gray-500 text-sm mt-1">Gérez votre flotte et suivez le statut de validation</p>
        </div>
        <button (click)="showForm.set(true)"
          class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          + Soumettre un camion
        </button>
      </div>

      <!-- Stats summary -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div class="text-2xl font-bold text-gray-900">{{ totalTrucks() }}</div>
          <div class="text-sm text-gray-500">Total camions</div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div class="text-2xl font-bold text-green-600">{{ availableTrucks() }}</div>
          <div class="text-sm text-gray-500">Disponibles</div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ pendingTrucks() }}</div>
          <div class="text-sm text-gray-500">En attente</div>
        </div>
      </div>

      <!-- Truck cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (truck of myTrucks(); track truck.id) {
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="font-bold font-mono text-lg">{{ truck.licensePlate }}</p>
                <p class="text-gray-600 text-sm">{{ truck.brand }} {{ truck.model }}</p>
              </div>
              <app-status-badge [status]="truck.status" />
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>🚛 {{ truck.capacityTons }} tonnes</div>
              <div>📅 {{ truck.year }}</div>
            </div>
            @if (truck.rejectionReason) {
              <div class="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <strong>Refusé :</strong> {{ truck.rejectionReason }}
              </div>
            }
          </div>
        } @empty {
          <div class="col-span-3 py-16 text-center text-gray-400">
            <div class="text-4xl mb-3">🚛</div>
            <p class="text-lg font-medium">Aucun camion</p>
            <p class="text-sm">Soumettez votre premier camion pour validation</p>
          </div>
        }
      </div>
    </div>

    <!-- Add Truck Modal -->
    @if (showForm()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
          <h3 class="text-lg font-bold mb-1">Soumettre un camion</h3>
          <p class="text-sm text-gray-500 mb-4">Votre camion sera examiné par un administrateur</p>
          <form (ngSubmit)="submit()" #truckForm="ngForm">
            <div class="grid grid-cols-2 gap-3">
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Immatriculation *</label>
                <input type="text" name="licensePlate" [(ngModel)]="form.licensePlate" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. AA-123-BB" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Marque *</label>
                <input type="text" name="brand" [(ngModel)]="form.brand" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. Volvo" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Modèle *</label>
                <input type="text" name="model" [(ngModel)]="form.model" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. FH16" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Capacité (tonnes) *</label>
                <input type="number" name="capacityTons" [(ngModel)]="form.capacityTons" required min="0.5" step="0.5"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Année *</label>
                <input type="number" name="year" [(ngModel)]="form.year" required min="1990" max="2030"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <div class="flex gap-3 mt-5">
              <button type="submit" [disabled]="!truckForm.form.valid"
                class="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium transition-colors">
                Soumettre pour validation
              </button>
              <button type="button" (click)="showForm.set(false)"
                class="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class OwnerTrucksComponent implements OnInit {
  private truckService = inject(TruckService);
  private authService = inject(AuthService);

  allTrucks = signal<TruckResponse[]>([]);
  showForm = signal(false);
  form: TruckRequest = { licensePlate: '', brand: '', model: '', capacityTons: 5, year: new Date().getFullYear() };

  myTrucks = computed(() => {
    const username = this.authService.currentUser()?.username ?? '';
    return this.allTrucks().filter(t => t.ownerUsername === username);
  });

  totalTrucks = computed(() => this.myTrucks().length);
  availableTrucks = computed(() => this.myTrucks().filter(t => t.status === 'AVAILABLE').length);
  pendingTrucks = computed(() => this.myTrucks().filter(t => t.status === 'PENDING_VALIDATION').length);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.truckService.getAll(0, 100).subscribe({
      next: page => this.allTrucks.set(page.content),
    });
  }

  submit(): void {
    this.truckService.create(this.form).subscribe({
      next: () => {
        this.showForm.set(false);
        this.form = { licensePlate: '', brand: '', model: '', capacityTons: 5, year: new Date().getFullYear() };
        this.load();
      },
    });
  }
}
