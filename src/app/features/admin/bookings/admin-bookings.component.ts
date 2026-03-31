import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { BookingResponse, BookingStatus } from '../../../core/models/booking.model';

@Component({
  selector: 'app-admin-bookings',
  imports: [DecimalPipe, DatePipe],
  template: `
    <div class="animate-fade-in">
      <div class="mb-6">
        <h1 class="text-3xl font-heading font-bold text-gradient uppercase">Réservations</h1>
        <p class="text-muted-foreground text-sm mt-1">Gérer toutes les réservations clients</p>
      </div>

      <div class="glass-card rounded-xl overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Référence</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Client</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Camion</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Dates</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Total</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Statut</th>
              <th class="text-right p-4 text-sm text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (booking of bookings(); track booking.id) {
              <tr class="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td class="p-4 text-foreground font-mono text-sm font-medium">{{ booking.bookingReference }}</td>
                <td class="p-4 text-foreground text-sm">{{ booking.customerName }}</td>
                <td class="p-4 text-sm">
                  <div class="text-foreground">{{ booking.truckName }}</div>
                  <div class="text-xs text-muted-foreground">{{ booking.truckLicensePlate }}</div>
                </td>
                <td class="p-4 text-sm text-foreground">
                  <div>{{ booking.pickupDate | date:'MMM d' }} - {{ booking.returnDate | date:'MMM d, y' }}</div>
                  <div class="text-xs text-muted-foreground">{{ booking.pickupLocationName }}</div>
                </td>
                <td class="p-4 text-foreground text-sm font-medium">{{ booking.totalPrice | number:'1.0-0' }} GNF</td>
                <td class="p-4">
                  <span [class]="statusClass(booking.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ booking.status }}
                  </span>
                </td>
                <td class="p-4">
                  <div class="flex items-center justify-end gap-1">
                    @if (booking.status === 'PENDING') {
                      <button (click)="confirm(booking.id)"
                        class="h-8 px-3 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-medium hover:bg-blue-500/30 transition-colors">
                        Confirmer
                      </button>
                    }
                    @if (booking.status === 'CONFIRMED') {
                      <button (click)="activate(booking.id)"
                        class="h-8 px-3 rounded-md bg-success/20 text-success border border-success/30 text-xs font-medium hover:bg-success/30 transition-colors">
                        Activer
                      </button>
                    }
                    @if (booking.status === 'ACTIVE') {
                      <button (click)="complete(booking.id)"
                        class="h-8 px-3 rounded-md bg-primary/20 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/30 transition-colors">
                        Terminer
                      </button>
                    }
                    @if (booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED') {
                      <button (click)="cancel(booking.id)"
                        class="h-8 px-3 rounded-md bg-destructive/20 text-destructive border border-destructive/30 text-xs font-medium hover:bg-destructive/30 transition-colors">
                        Annuler
                      </button>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="p-8 text-center text-muted-foreground text-sm">Aucune réservation trouvée</td>
              </tr>
            }
          </tbody>
        </table>

        @if (totalPages() > 1) {
          <div class="flex items-center justify-between p-4 border-t border-border">
            <span class="text-sm text-muted-foreground">Page {{ currentPage() + 1 }} sur {{ totalPages() }}</span>
            <div class="flex gap-2">
              <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                class="px-3 py-1.5 rounded-md bg-secondary text-foreground text-sm disabled:opacity-40 hover:bg-muted transition-colors">
                Précédent
              </button>
              <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1.5 rounded-md bg-secondary text-foreground text-sm disabled:opacity-40 hover:bg-muted transition-colors">
                Suivant
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);

  bookings = signal<BookingResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.bookingService.getAll(this.currentPage(), 10).subscribe({
      next: (page) => { this.bookings.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number): void { this.currentPage.set(page); this.load(); }

  confirm(id: number): void {
    this.bookingService.confirm(id).subscribe({ next: () => this.load() });
  }

  activate(id: number): void {
    this.bookingService.activate(id).subscribe({ next: () => this.load() });
  }

  complete(id: number): void {
    this.bookingService.complete(id).subscribe({ next: () => this.load() });
  }

  cancel(id: number): void {
    this.bookingService.cancel(id).subscribe({ next: () => this.load() });
  }

  statusClass(status: BookingStatus): string {
    const map: Record<BookingStatus, string> = {
      PENDING: 'bg-yellow-500/20 text-yellow-400',
      CONFIRMED: 'bg-blue-500/20 text-blue-400',
      ACTIVE: 'bg-green-500/20 text-green-400',
      COMPLETED: 'bg-primary/20 text-primary',
      CANCELLED: 'bg-destructive/20 text-destructive',
    };
    return map[status] ?? '';
  }
}
