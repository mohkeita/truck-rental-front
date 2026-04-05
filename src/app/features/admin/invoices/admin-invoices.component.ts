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
        <h1 class="text-2xl font-bold text-foreground">Gestion des factures</h1>
      </div>

      <div class="glass-card rounded-xl overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead class="bg-secondary/50 border-b border-border">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Contrat</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Client</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Montant</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date d'&eacute;mission</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date d'&eacute;ch&eacute;ance</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Statut</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            @for (invoice of invoices(); track invoice.id) {
              <tr class="hover:bg-secondary/30 transition-colors">
                <td class="px-4 py-3 text-sm text-muted-foreground">#{{ invoice.id }}</td>
                <td class="px-4 py-3 text-sm text-foreground">Contrat #{{ invoice.contractId }}</td>
                <td class="px-4 py-3 text-sm text-foreground">{{ invoice.clientUsername }}</td>
                <td class="px-4 py-3 font-semibold text-primary">{{ invoice.amount | number:'1.0-0' }} GNF</td>
                <td class="px-4 py-3 text-sm text-muted-foreground">{{ invoice.issueDate }}</td>
                <td class="px-4 py-3 text-sm text-muted-foreground">{{ invoice.dueDate }}</td>
                <td class="px-4 py-3"><app-status-badge [status]="invoice.status" /></td>
                <td class="px-4 py-3">
                  @if (invoice.status === 'PENDING' || invoice.status === 'OVERDUE') {
                    <button (click)="pay(invoice.id)"
                      class="px-3 py-1 bg-success/10 text-success hover:bg-success/20 rounded text-xs font-medium transition-colors">
                      Marquer pay&eacute;
                    </button>
                  }
                </td>
              </tr>
            } @empty {
              <tr><td colspan="8" class="px-4 py-12 text-center text-muted-foreground">Aucune facture trouv&eacute;e</td></tr>
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
