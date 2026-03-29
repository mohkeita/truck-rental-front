import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { ClientResponse, ClientRequest } from '../../../core/models/client.model';

@Component({
  selector: 'app-admin-clients',
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Clients Management</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Username</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (client of clients(); track client.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-blue-600">{{ client.username }}</td>
                <td class="px-4 py-3">{{ client.firstName }} {{ client.lastName }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ client.email }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ client.company ?? '—' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ client.phone ?? '—' }}</td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="px-4 py-12 text-center text-gray-400">No clients found</td></tr>
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
export class AdminClientsComponent implements OnInit {
  private clientService = inject(ClientService);

  clients = signal<ClientResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.clientService.getAll(this.currentPage(), 10).subscribe({
      next: page => { this.clients.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number): void { this.currentPage.set(page); this.load(); }
}
