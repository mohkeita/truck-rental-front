import { Component, signal, OnInit } from '@angular/core';
import { ClientService } from '../../../core/services/client.service';
import { ClientResponse } from '../../../core/models/client.model';

@Component({
  selector: 'app-admin-clients',
  standalone: true,
  imports: [],
  template: `
    <div class="animate-fade-in">
      <div class="mb-6">
        <h1 class="text-3xl font-heading font-bold text-gradient uppercase">Clients</h1>
        <p class="text-muted-foreground text-sm mt-1">Registered client accounts</p>
      </div>

      <div class="glass-card rounded-xl overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Username</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Full Name</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Email</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Company</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Phone</th>
            </tr>
          </thead>
          <tbody>
            @for (client of clients(); track client.id) {
              <tr class="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td class="p-4 text-foreground font-medium text-sm">{{ client.username }}</td>
                <td class="p-4 text-foreground text-sm">{{ client.firstName }} {{ client.lastName }}</td>
                <td class="p-4 text-muted-foreground text-sm">{{ client.email }}</td>
                <td class="p-4 text-muted-foreground text-sm">{{ client.company ?? '—' }}</td>
                <td class="p-4 text-muted-foreground text-sm">{{ client.phone ?? '—' }}</td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="p-8 text-center text-muted-foreground text-sm">No clients found</td></tr>
            }
          </tbody>
        </table>
        @if (totalPages() > 1) {
          <div class="flex items-center justify-between p-4 border-t border-border">
            <span class="text-sm text-muted-foreground">Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
            <div class="flex gap-2">
              <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                class="px-3 py-1.5 rounded-md bg-secondary text-foreground text-sm disabled:opacity-40 hover:bg-muted transition-colors">← Prev</button>
              <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1.5 rounded-md bg-secondary text-foreground text-sm disabled:opacity-40 hover:bg-muted transition-colors">Next →</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminClientsComponent implements OnInit {
  clients = signal<ClientResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);

  constructor(private clientService: ClientService) {}

  ngOnInit() { this.load(); }

  load() {
    this.clientService.getAll(this.currentPage(), 10).subscribe({
      next: (page) => { this.clients.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number) { this.currentPage.set(page); this.load(); }
}
