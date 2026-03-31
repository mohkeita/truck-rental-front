import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { BookingResponse, BookingStatus } from '../../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  imports: [DecimalPipe, DatePipe, FormsModule],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Mes réservations</h1>
        <p class="text-gray-500 text-sm mt-1">Suivez vos locations de camions</p>
      </div>

      <div class="space-y-4">
        @for (booking of bookings(); track booking.id) {
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <div class="flex items-center gap-3">
                  <h3 class="font-bold text-gray-900">{{ booking.truckName }}</h3>
                  <span [class]="statusClass(booking.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ booking.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">Réf : {{ booking.bookingReference }}</p>
              </div>
              <p class="text-xl font-bold text-gray-900">{{ booking.totalPrice | number:'1.0-0' }} GNF</p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
              <div>
                <p class="text-gray-500 text-xs">Retrait</p>
                <p class="text-gray-900 font-medium">{{ booking.pickupDate | date:'MMM d, y HH:mm' }}</p>
                <p class="text-gray-500 text-xs">{{ booking.pickupLocationName }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs">Retour</p>
                <p class="text-gray-900 font-medium">{{ booking.returnDate | date:'MMM d, y HH:mm' }}</p>
                <p class="text-gray-500 text-xs">{{ booking.returnLocationName }}</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs">Prix de base</p>
                <p class="text-gray-900 font-medium">{{ booking.basePrice | number:'1.0-0' }} GNF</p>
              </div>
              <div>
                <p class="text-gray-500 text-xs">Taxe ({{ booking.taxRate }}%)</p>
                <p class="text-gray-900 font-medium">{{ booking.taxAmount | number:'1.0-0' }} GNF</p>
              </div>
            </div>

            @if (booking.extras.length > 0) {
              <div class="mb-4">
                <p class="text-xs text-gray-500 mb-1">Options :</p>
                <div class="flex flex-wrap gap-2">
                  @for (extra of booking.extras; track extra.id) {
                    <span class="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {{ extra.name }} ({{ extra.pricePerDay | number:'1.0-0' }} GNF/jour)
                    </span>
                  }
                </div>
              </div>
            }

            @if (booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED') {
              <div class="flex justify-end">
                @if (!showCancelInput() || cancelBookingId() !== booking.id) {
                  <button (click)="openCancel(booking.id)"
                    class="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                    Annuler la réservation
                  </button>
                } @else {
                  <div class="flex gap-2 items-end">
                    <input [(ngModel)]="cancelReason" name="cancelReason" placeholder="Motif (facultatif)"
                      class="h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                    <button (click)="confirmCancel()"
                      class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                      Confirmer
                    </button>
                    <button (click)="showCancelInput.set(false)"
                      class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Retour
                    </button>
                  </div>
                }
              </div>
            }

            @if (booking.cancellationReason) {
              <p class="text-sm text-red-500 mt-2">Annulé : {{ booking.cancellationReason }}</p>
            }
          </div>
        } @empty {
          <div class="py-16 text-center text-gray-400">
            <div class="text-4xl mb-3">📋</div>
            <p class="text-lg font-medium">Aucune réservation</p>
            <p class="text-sm">Parcourez les camions disponibles pour votre première réservation</p>
          </div>
        }
      </div>

      @if (totalPages() > 1) {
        <div class="mt-6 flex items-center justify-center gap-2">
          <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            Précédent
          </button>
          <span class="text-sm text-gray-500">Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
          <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
            Suivant
          </button>
        </div>
      }
    </div>
  `,
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);

  bookings = signal<BookingResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  showCancelInput = signal(false);
  cancelBookingId = signal(0);
  cancelReason = '';

  ngOnInit(): void { this.load(); }

  load(): void {
    this.bookingService.getMyBookings(this.currentPage(), 10).subscribe({
      next: (page) => { this.bookings.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number): void { this.currentPage.set(page); this.load(); }

  openCancel(id: number): void {
    this.cancelBookingId.set(id);
    this.cancelReason = '';
    this.showCancelInput.set(true);
  }

  confirmCancel(): void {
    this.bookingService.cancel(this.cancelBookingId(), this.cancelReason).subscribe({
      next: () => { this.showCancelInput.set(false); this.load(); },
    });
  }

  statusClass(status: BookingStatus): string {
    const map: Record<BookingStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      ACTIVE: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return map[status] ?? '';
  }
}
