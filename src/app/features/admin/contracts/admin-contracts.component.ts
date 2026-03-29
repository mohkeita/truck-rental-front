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
        <h1 class="text-2xl font-bold text-gray-900">Contracts Management</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Truck</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Dates</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total Cost</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (contract of contracts(); track contract.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-500">#{{ contract.id }}</td>
                <td class="px-4 py-3">
                  <div class="font-medium font-mono text-sm">{{ contract.truckLicensePlate }}</div>
                  <div class="text-xs text-gray-500">{{ contract.truckBrand }}</div>
                </td>
                <td class="px-4 py-3 text-sm">{{ contract.clientUsername }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  <div>{{ contract.startDate }}</div>
                  <div>→ {{ contract.endDate }}</div>
                </td>
                <td class="px-4 py-3 font-semibold">{{ contract.totalCost | number:'1.0-2' }} €</td>
                <td class="px-4 py-3"><app-status-badge [status]="contract.status" /></td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    @if (contract.status === 'ACTIVE') {
                      <button (click)="complete(contract.id)"
                        class="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium">
                        Complete
                      </button>
                      <button (click)="cancel(contract.id)"
                        class="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium">
                        Cancel
                      </button>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="px-4 py-12 text-center text-gray-400">No contracts found</td></tr>
            }
          </tbody>
        </table>

        @if (totalPages() > 1) {
          <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <span class="text-sm text-gray-500">Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
            <div class="flex gap-2">
              <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50">Previous</button>
              <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
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
    if (confirm('Mark this contract as completed?')) {
      this.contractService.complete(id).subscribe({ next: () => this.load() });
    }
  }

  cancel(id: number): void {
    if (confirm('Cancel this contract?')) {
      this.contractService.cancel(id).subscribe({ next: () => this.load() });
    }
  }
}
