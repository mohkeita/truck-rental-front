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
        <h1 class="text-2xl font-bold text-foreground">Gestion des missions</h1>
      </div>

      <div class="glass-card rounded-xl overflow-hidden">
        <table class="w-full">
          <thead class="bg-secondary/50 border-b border-border">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Camion</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Trajet</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Chauffeur</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date d&eacute;but</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Statut</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Modifier</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            @for (mission of missions(); track mission.id) {
              <tr class="hover:bg-secondary/30 transition-colors">
                <td class="px-4 py-3 text-sm text-muted-foreground">#{{ mission.id }}</td>
                <td class="px-4 py-3 font-mono text-sm font-medium text-foreground">{{ mission.truckLicensePlate }}</td>
                <td class="px-4 py-3 text-sm">
                  <div class="text-foreground">{{ mission.origin }}</div>
                  <div class="text-muted-foreground">&rarr; {{ mission.destination }}</div>
                </td>
                <td class="px-4 py-3 text-sm text-muted-foreground">{{ mission.driverName ?? '—' }}</td>
                <td class="px-4 py-3 text-sm text-muted-foreground">{{ mission.startDate }}</td>
                <td class="px-4 py-3"><app-status-badge [status]="mission.status" /></td>
                <td class="px-4 py-3">
                  <select
                    [value]="mission.status"
                    (change)="updateStatus(mission.id, $any($event.target).value)"
                    class="text-xs bg-background border border-border text-foreground rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="PLANNED">Planifi&eacute;e</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Termin&eacute;e</option>
                    <option value="CANCELLED">Annul&eacute;e</option>
                  </select>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="px-4 py-12 text-center text-muted-foreground">Aucune mission trouv&eacute;e</td></tr>
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
