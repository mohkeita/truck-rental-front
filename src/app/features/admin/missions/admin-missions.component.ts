import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MissionService } from '../../../core/services/mission.service';
import { MissionResponse, MissionStatus } from '../../../core/models/mission.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-missions',
  imports: [FormsModule, StatusBadgeComponent],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Missions Management</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Truck</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Route</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Driver</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Start Date</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Update</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (mission of missions(); track mission.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-500">#{{ mission.id }}</td>
                <td class="px-4 py-3 font-mono text-sm font-medium">{{ mission.truckLicensePlate }}</td>
                <td class="px-4 py-3 text-sm">
                  <div>{{ mission.origin }}</div>
                  <div class="text-gray-500">→ {{ mission.destination }}</div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ mission.driverName ?? '—' }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ mission.startDate }}</td>
                <td class="px-4 py-3"><app-status-badge [status]="mission.status" /></td>
                <td class="px-4 py-3">
                  <select
                    [value]="mission.status"
                    (change)="updateStatus(mission.id, $any($event.target).value)"
                    class="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="PLANNED">Planned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="px-4 py-12 text-center text-gray-400">No missions found</td></tr>
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
export class AdminMissionsComponent implements OnInit {
  private missionService = inject(MissionService);

  missions = signal<MissionResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.missionService.getAll(this.currentPage(), 10).subscribe({
      next: page => { this.missions.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number): void { this.currentPage.set(page); this.load(); }

  updateStatus(id: number, status: MissionStatus): void {
    this.missionService.updateStatus(id, status).subscribe({ next: () => this.load() });
  }
}
