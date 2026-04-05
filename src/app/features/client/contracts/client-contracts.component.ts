import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../../core/services/contract.service';
import { ContractResponse, ContractRequest } from '../../../core/models/contract.model';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse } from '../../../core/models/truck.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

@Component({
  selector: 'app-client-contracts',
  imports: [FormsModule, StatusBadgeComponent],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mes contrats</h1>
          <p class="text-gray-500 text-sm mt-1">{{ contracts().length }} contrats au total</p>
        </div>
        <button (click)="openForm()"
          class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
          + Nouveau contrat
        </button>
      </div>

      <!-- Contracts list -->
      <div class="space-y-3">
        @for (contract of contracts(); track contract.id) {
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="font-mono font-bold text-gray-900">{{ contract.truckLicensePlate }}</span>
                  <span class="text-gray-500 text-sm">{{ contract.truckBrand }}</span>
                  <app-status-badge [status]="contract.status" />
                </div>
                <div class="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span class="text-xs text-gray-400 block">Période</span>
                    {{ contract.startDate }} → {{ contract.endDate }}
                  </div>
                  <div>
                    <span class="text-xs text-gray-400 block">Tarif journalier</span>
                    {{ contract.dailyRate }} GNF/jour
                  </div>
                  <div>
                    <span class="text-xs text-gray-400 block">Coût total</span>
                    <span class="font-semibold text-gray-900">{{ contract.totalCost }} GNF</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button (click)="downloadPdf(contract.id)"
                  class="px-3 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  PDF
                </button>
                @if (contract.status === 'ACTIVE') {
                  <button (click)="cancel(contract.id)"
                    class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors">
                    Annuler
                  </button>
                }
              </div>
            </div>
          </div>
        } @empty {
          <div class="py-16 text-center text-gray-400">
            <div class="text-4xl mb-3">📄</div>
            <p class="text-lg font-medium">Aucun contrat</p>
            <p class="text-sm">Parcourez les camions disponibles et créez votre premier contrat</p>
          </div>
        }
      </div>
    </div>

    <!-- New Contract Modal -->
    @if (showForm()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
          <h3 class="text-lg font-bold mb-4">Créer un nouveau contrat</h3>
          <form (ngSubmit)="submit()" #contractForm="ngForm">
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Camion *</label>
                <select name="truckId" [(ngModel)]="form.truckId" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option [value]="0" disabled>Sélectionner un camion</option>
                  @for (truck of availableTrucks(); track truck.id) {
                    <option [value]="truck.id">{{ truck.brand }} {{ truck.model }} — {{ truck.licensePlate }}</option>
                  }
                </select>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Date de début *</label>
                  <input type="date" name="startDate" [(ngModel)]="form.startDate" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Date de fin *</label>
                  <input type="date" name="endDate" [(ngModel)]="form.endDate" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Tarif journalier (GNF) *</label>
                <input type="number" name="dailyRate" [(ngModel)]="form.dailyRate" required min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. 150" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <textarea name="notes" [(ngModel)]="form.notes" rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Notes facultatives..."></textarea>
              </div>
            </div>
            <div class="flex gap-3 mt-5">
              <button type="submit" [disabled]="!contractForm.form.valid || !form.truckId"
                class="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium transition-colors">
                Créer le contrat
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
export class ClientContractsComponent implements OnInit {
  private contractService = inject(ContractService);
  private truckService = inject(TruckService);
  private route = inject(ActivatedRoute);

  contracts = signal<ContractResponse[]>([]);
  availableTrucks = signal<TruckResponse[]>([]);
  showForm = signal(false);
  form: ContractRequest = { truckId: 0, startDate: '', endDate: '', dailyRate: 100 };

  ngOnInit(): void {
    this.loadContracts();
    this.loadTrucks();

    const truckId = this.route.snapshot.queryParamMap.get('truckId');
    if (truckId) {
      this.form.truckId = parseInt(truckId, 10);
      this.showForm.set(true);
    }
  }

  loadContracts(): void {
    this.contractService.getMy(0, 50).subscribe({
      next: page => this.contracts.set(page.content),
    });
  }

  loadTrucks(): void {
    this.truckService.getAvailable(0, 50).subscribe({
      next: page => this.availableTrucks.set(page.content),
    });
  }

  openForm(): void {
    this.form = { truckId: 0, startDate: '', endDate: '', dailyRate: 100 };
    this.showForm.set(true);
  }

  submit(): void {
    this.contractService.create(this.form).subscribe({
      next: () => {
        this.showForm.set(false);
        this.loadContracts();
      },
    });
  }

  cancel(id: number): void {
    if (confirm('Annuler ce contrat ?')) {
      this.contractService.cancel(id).subscribe({ next: () => this.loadContracts() });
    }
  }

  downloadPdf(id: number): void {
    this.contractService.downloadPdf(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contrat-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('PDF download error:', err);
        alert('Impossible de télécharger le PDF. Veuillez réessayer.');
      },
    });
  }
}
