import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ContractService } from '../../../core/services/contract.service';
import { ContractResponse } from '../../../core/models/contract.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-contracts',
  imports: [StatusBadgeComponent, DecimalPipe],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-foreground">Gestion des contrats</h1>
      </div>

      <div class="glass-card rounded-xl overflow-x-auto">
        <table class="w-full min-w-[750px]">
          <thead class="bg-secondary/50 border-b border-border">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Camion</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Client</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Dates</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Co&ucirc;t total</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Statut</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            @for (contract of contracts(); track contract.id) {
              <tr class="hover:bg-secondary/30 transition-colors">
                <td class="px-4 py-3 text-sm text-muted-foreground">#{{ contract.id }}</td>
                <td class="px-4 py-3">
                  <div class="font-medium font-mono text-sm text-foreground">{{ contract.truckLicensePlate }}</div>
                  <div class="text-xs text-muted-foreground">{{ contract.truckBrand }}</div>
                </td>
                <td class="px-4 py-3 text-sm text-foreground">{{ contract.clientUsername }}</td>
                <td class="px-4 py-3 text-sm text-muted-foreground">
                  <div>{{ contract.startDate }}</div>
                  <div>&rarr; {{ contract.endDate }}</div>
                </td>
                <td class="px-4 py-3 font-semibold text-primary">{{ contract.totalCost | number:'1.0-2' }} GNF</td>
                <td class="px-4 py-3"><app-status-badge [status]="contract.status" /></td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    @if (contract.status === 'ACTIVE') {
                      <button (click)="complete(contract.id)"
                        class="px-3 py-1 bg-success/10 text-success hover:bg-success/20 rounded text-xs font-medium transition-colors">
                        Terminer
                      </button>
                      <button (click)="cancel(contract.id)"
                        class="px-3 py-1 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded text-xs font-medium transition-colors">
                        Annuler
                      </button>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="px-4 py-12 text-center text-muted-foreground">Aucun contrat trouv&eacute;</td></tr>
            }
          </tbody>
        </table>

        @if (totalPages() > 1) {
          <div class="px-4 py-3 border-t border-border flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Page {{ currentPage() + 1 }} sur {{ totalPages() }}</span>
            <div class="flex gap-2">
              <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                class="px-3 py-1 border border-border rounded text-sm text-foreground disabled:opacity-40 hover:bg-secondary transition-colors">Pr&eacute;c&eacute;dent</button>
              <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1 border border-border rounded text-sm text-foreground disabled:opacity-40 hover:bg-secondary transition-colors">Suivant</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminContractsComponent implements OnInit {
  private contractService = inject(ContractService);

  contracts = signal<ContractResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.contractService.getAll(this.currentPage(), 10).subscribe({
      next: page => { this.contracts.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number): void { this.currentPage.set(page); this.load(); }

  complete(id: number): void {
    if (confirm('Marquer ce contrat comme terminé ?')) {
      this.contractService.complete(id).subscribe({ next: () => this.load() });
    }
  }

  cancel(id: number): void {
    if (confirm('Annuler ce contrat ?')) {
      this.contractService.cancel(id).subscribe({ next: () => this.load() });
    }
  }
}
