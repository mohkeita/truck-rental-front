import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { InvoiceService } from '../../../core/services/invoice.service';
import { InvoiceResponse } from '../../../core/models/invoice.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-invoices',
  imports: [StatusBadgeComponent, DecimalPipe],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestion des factures</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contrat</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Montant</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date d'émission</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date d'échéance</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (invoice of invoices(); track invoice.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-500">#{{ invoice.id }}</td>
                <td class="px-4 py-3 text-sm">Contrat #{{ invoice.contractId }}</td>
                <td class="px-4 py-3 text-sm">{{ invoice.clientUsername }}</td>
                <td class="px-4 py-3 font-semibold">{{ invoice.amount | number:'1.0-0' }} GNF</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ invoice.issueDate }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ invoice.dueDate }}</td>
                <td class="px-4 py-3"><app-status-badge [status]="invoice.status" /></td>
                <td class="px-4 py-3">
                  @if (invoice.status === 'PENDING' || invoice.status === 'OVERDUE') {
                    <button (click)="pay(invoice.id)"
                      class="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium">
                      💳 Marquer payé
                    </button>
                  }
                </td>
              </tr>
            } @empty {
              <tr><td colspan="8" class="px-4 py-12 text-center text-gray-400">Aucune facture trouvée</td></tr>
            }
          </tbody>
        </table>

        @if (totalPages() > 1) {
          <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <span class="text-sm text-gray-500">Page {{ currentPage() + 1 }} sur {{ totalPages() }}</span>
            <div class="flex gap-2">
              <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50">Précédent</button>
              <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-40 hover:bg-gray-50">Suivant</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminInvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);

  invoices = signal<InvoiceResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.invoiceService.getAll(this.currentPage(), 10).subscribe({
      next: page => { this.invoices.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number): void { this.currentPage.set(page); this.load(); }

  pay(id: number): void {
    this.invoiceService.pay(id).subscribe({ next: () => this.load() });
  }
}
