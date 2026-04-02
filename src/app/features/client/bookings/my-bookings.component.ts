import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { PaymentService } from '../../../core/services/payment.service';
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
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-bold text-gray-900">{{ booking.truckName }}</h3>
                  <span [class]="statusClass(booking.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ statusLabel(booking.status) }}
                  </span>
                </div>
                <p class="text-sm text-gray-500 mt-1">Réf : {{ booking.bookingReference }}</p>
              </div>
              <p class="text-xl font-bold text-gray-900 shrink-0">{{ booking.totalPrice | number:'1.0-0' }} GNF</p>
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
              <div class="flex justify-end gap-2">
                @if (booking.status === 'PENDING_PAYMENT') {
                  <button (click)="retryPayment(booking.id)" [disabled]="payingBookingId() === booking.id"
                    class="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50">
                    {{ payingBookingId() === booking.id ? 'Redirection...' : 'Payer maintenant' }}
                  </button>
                }
                @if (!showCancelInput() || cancelBookingId() !== booking.id) {
                  <button (click)="openCancel(booking.id)"
                    class="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                    Annuler la réservation
                  </button>
                } @else {
                  <div class="flex flex-col sm:flex-row gap-2 sm:items-end">
                    <input [(ngModel)]="cancelReason" name="cancelReason" placeholder="Motif (facultatif)"
                      class="h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto" />
                    <div class="flex gap-2">
                      <button (click)="confirmCancel()"
                        class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                        Confirmer
                      </button>
                      <button (click)="showCancelInput.set(false)"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        Retour
                      </button>
                    </div>
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
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium disabled:opacity-40 hover:bg-gray-50">
            Précédent
          </button>
          <span class="text-sm text-gray-600">Page {{ currentPage() + 1 }} sur {{ totalPages() }}</span>
          <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 font-medium disabled:opacity-40 hover:bg-gray-50">
            Suivant
          </button>
        </div>
      }
    </div>
  `,
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);

  bookings = signal<BookingResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  showCancelInput = signal(false);
  cancelBookingId = signal(0);
  cancelReason = '';
  payingBookingId = signal(0);

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

  retryPayment(bookingId: number): void {
    this.payingBookingId.set(bookingId);
    this.paymentService.initiatePayment(bookingId).subscribe({
      next: (payment) => {
        window.location.href = payment.paymentUrl;
      },
      error: () => {
        this.payingBookingId.set(0);
      },
    });
  }

  statusLabel(status: BookingStatus): string {
    const labels: Record<BookingStatus, string> = {
      PENDING: 'En attente',
      PENDING_PAYMENT: 'En attente de paiement',
      CONFIRMED: 'Confirmée',
      ACTIVE: 'En cours',
      COMPLETED: 'Terminée',
      CANCELLED: 'Annulée',
    };
    return labels[status] ?? status;
  }

  statusClass(status: BookingStatus): string {
    const map: Record<BookingStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PENDING_PAYMENT: 'bg-orange-100 text-orange-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      ACTIVE: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return map[status] ?? '';
  }
}
