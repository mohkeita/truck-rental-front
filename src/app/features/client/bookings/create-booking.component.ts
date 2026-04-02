import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { LocationService } from '../../../core/services/location.service';
import { TruckService } from '../../../core/services/truck.service';
import { PaymentService } from '../../../core/services/payment.service';
import { LocationResponse } from '../../../core/models/location.model';
import { TruckResponse } from '../../../core/models/truck.model';
import { BookingRequest, ExtraRequest } from '../../../core/models/booking.model';

@Component({
  selector: 'app-create-booking',
  imports: [FormsModule, DecimalPipe],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Réserver un camion</h1>
        <p class="text-gray-500 text-sm mt-1">Remplissez les détails pour réserver votre camion</p>
      </div>

      @if (truck()) {
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <div class="flex items-center gap-4">
            <div class="text-4xl">🚛</div>
            <div>
              <h3 class="font-bold text-lg text-gray-900">{{ truck()!.brand }} {{ truck()!.model }}</h3>
              <p class="text-sm text-gray-500">{{ truck()!.licensePlate }} - {{ truck()!.capacityTons }} tonnes</p>
              @if (truck()!.pricePerDay) {
                <p class="text-lg font-bold text-orange-500 mt-1">{{ truck()!.pricePerDay | number:'1.0-0' }} GNF/jour</p>
              }
            </div>
          </div>
        </div>
      }

      <form (ngSubmit)="submit()" class="space-y-6">
        <!-- Dates -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 class="font-bold text-gray-900 mb-4">Période de location</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de retrait</label>
              <input type="date" [(ngModel)]="pickupDate" name="pickupDate" required
                class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date de retour</label>
              <input type="date" [(ngModel)]="returnDate" name="returnDate" required
                class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        <!-- Locations -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 class="font-bold text-gray-900 mb-4">Lieux</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lieu de retrait</label>
              <select [(ngModel)]="pickupLocationId" name="pickupLocationId" required
                class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option [ngValue]="0" disabled>Sélectionner un lieu</option>
                @for (loc of locations(); track loc.id) {
                  <option [ngValue]="loc.id">{{ loc.name }} - {{ loc.city }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lieu de retour</label>
              <select [(ngModel)]="returnLocationId" name="returnLocationId" required
                class="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option [ngValue]="0" disabled>Sélectionner un lieu</option>
                @for (loc of locations(); track loc.id) {
                  <option [ngValue]="loc.id">{{ loc.name }} - {{ loc.city }}</option>
                }
              </select>
            </div>
          </div>
        </div>

        <!-- Extras -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-900">Options (Facultatif)</h3>
            <button type="button" (click)="addExtra()"
              class="text-sm text-orange-500 hover:text-orange-600 font-medium">+ Ajouter une option</button>
          </div>
          @for (extra of extras; track $index; let i = $index) {
            <div class="flex gap-3 items-end mb-3">
              <div class="flex-1">
                <label class="block text-xs font-medium text-gray-500 mb-1">Nom</label>
                <input [(ngModel)]="extra.name" [name]="'extraName' + i" placeholder="ex. GPS, Siège enfant"
                  class="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div class="w-32">
                <label class="block text-xs font-medium text-gray-500 mb-1">Prix/Jour</label>
                <input type="number" [(ngModel)]="extra.pricePerDay" [name]="'extraPrice' + i" min="0" step="0.01"
                  class="w-full h-9 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <button type="button" (click)="removeExtra(i)"
                class="h-9 w-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center text-sm">
                X
              </button>
            </div>
          }
        </div>

        <!-- Submit -->
        <div class="flex items-center justify-between">
          <button type="button" (click)="goBack()"
            class="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button type="submit" [disabled]="submitting()"
            class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50">
            {{ submitting() ? 'Traitement...' : 'Réserver et payer' }}
          </button>
        </div>
      </form>

      @if (error()) {
        <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error() }}
        </div>
      }
    </div>
  `,
})
export class CreateBookingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private locationService = inject(LocationService);
  private truckService = inject(TruckService);
  private paymentService = inject(PaymentService);

  truck = signal<TruckResponse | null>(null);
  locations = signal<LocationResponse[]>([]);
  submitting = signal(false);
  error = signal('');

  truckId = 0;
  pickupDate = '';
  returnDate = '';
  pickupLocationId = 0;
  returnLocationId = 0;
  extras: ExtraRequest[] = [];

  ngOnInit(): void {
    this.truckId = Number(this.route.snapshot.queryParamMap.get('truckId') || 0);

    this.locationService.getAll().subscribe({
      next: (data) => this.locations.set(data),
    });

    if (this.truckId) {
      this.truckService.getAvailable(0, 100).subscribe({
        next: (page) => {
          const found = page.content.find(t => t.id === this.truckId);
          if (found) this.truck.set(found);
        },
      });
    }
  }

  addExtra(): void {
    this.extras = [...this.extras, { name: '', pricePerDay: 0 }];
  }

  removeExtra(index: number): void {
    this.extras = this.extras.filter((_, i) => i !== index);
  }

  submit(): void {
    this.error.set('');
    this.submitting.set(true);

    const request: BookingRequest = {
      truckId: this.truckId,
      pickupLocationId: this.pickupLocationId,
      returnLocationId: this.returnLocationId,
      pickupDate: this.pickupDate,
      returnDate: this.returnDate,
      extras: this.extras.filter(e => e.name.trim() && e.pricePerDay > 0),
    };

    this.bookingService.create(request).subscribe({
      next: (booking) => {
        // Initiate payment after booking creation
        this.paymentService.initiatePayment(booking.id).subscribe({
          next: (payment) => {
            this.submitting.set(false);
            // Redirect to CinetPay payment page
            window.location.href = payment.paymentUrl;
          },
          error: (err) => {
            this.submitting.set(false);
            this.error.set(err.error?.message || err.error?.error || 'Échec de l\'initialisation du paiement. Vous pouvez réessayer depuis vos réservations.');
            // Booking was created but payment failed — user can retry from bookings list
            this.router.navigate(['/client/bookings']);
          },
        });
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.message || err.error?.error || 'Échec de la création de la réservation');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/client/trucks']);
  }
}
