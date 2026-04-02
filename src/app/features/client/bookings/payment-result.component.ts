import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { PaymentStatusResponse } from '../../../core/models/payment.model';

@Component({
  selector: 'app-payment-result',
  imports: [RouterLink],
  template: `
    <div class="flex items-center justify-center min-h-[60vh]">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">

        @if (loading()) {
          <div class="mb-6">
            <div class="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Vérification du paiement...</h2>
          <p class="text-gray-500 text-sm">Veuillez patienter, nous vérifions votre paiement</p>
          <p class="text-gray-400 text-xs mt-2">Tentative {{ attempts() }}/10</p>
        }

        @if (result() && !loading()) {
          @if (result()!.status === 'SUCCESSFUL') {
            <div class="mb-6">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span class="text-3xl">&#10003;</span>
              </div>
            </div>
            <h2 class="text-xl font-bold text-green-700 mb-2">Paiement réussi !</h2>
            <p class="text-gray-500 text-sm mb-1">Votre réservation est confirmée.</p>
            @if (result()!.paymentMethod) {
              <p class="text-gray-400 text-xs">Méthode : {{ result()!.paymentMethod }}</p>
            }
          } @else if (result()!.status === 'FAILED' || result()!.status === 'CANCELLED') {
            <div class="mb-6">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span class="text-3xl">&#10007;</span>
              </div>
            </div>
            <h2 class="text-xl font-bold text-red-700 mb-2">Paiement échoué</h2>
            <p class="text-gray-500 text-sm">Le paiement n'a pas abouti. Votre réservation a été annulée.</p>
          } @else if (result()!.status === 'EXPIRED') {
            <div class="mb-6">
              <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <span class="text-3xl">&#9203;</span>
              </div>
            </div>
            <h2 class="text-xl font-bold text-yellow-700 mb-2">Paiement expiré</h2>
            <p class="text-gray-500 text-sm">Le délai de paiement a expiré. Veuillez créer une nouvelle réservation.</p>
          } @else {
            <div class="mb-6">
              <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <span class="text-3xl">&#8987;</span>
              </div>
            </div>
            <h2 class="text-xl font-bold text-yellow-700 mb-2">Paiement en cours de traitement</h2>
            <p class="text-gray-500 text-sm">Votre paiement est en cours de vérification. Vous recevrez une confirmation sous peu.</p>
          }

          <div class="mt-6">
            <a routerLink="/client/bookings"
              class="inline-flex items-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm">
              Voir mes réservations
            </a>
          </div>
        }

        @if (error()) {
          <div class="mb-6">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span class="text-3xl">?</span>
            </div>
          </div>
          <h2 class="text-xl font-bold text-gray-700 mb-2">Impossible de vérifier le paiement</h2>
          <p class="text-gray-500 text-sm mb-4">{{ error() }}</p>
          <a routerLink="/client/bookings"
            class="inline-flex items-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm">
            Voir mes réservations
          </a>
        }
      </div>
    </div>
  `,
})
export class PaymentResultComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);

  loading = signal(true);
  result = signal<PaymentStatusResponse | null>(null);
  error = signal('');
  attempts = signal(0);

  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private maxAttempts = 10;

  ngOnInit(): void {
    const transactionId = this.route.snapshot.queryParamMap.get('transaction_id');
    if (!transactionId) {
      this.loading.set(false);
      this.error.set('Identifiant de transaction manquant');
      return;
    }

    this.pollStatus(transactionId);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  private pollStatus(transactionId: string): void {
    const check = () => {
      this.attempts.update(a => a + 1);

      this.paymentService.checkStatus(transactionId).subscribe({
        next: (response) => {
          if (response.status === 'SUCCESSFUL' || response.status === 'FAILED'
            || response.status === 'CANCELLED' || response.status === 'EXPIRED') {
            this.result.set(response);
            this.loading.set(false);
            if (this.pollInterval) {
              clearInterval(this.pollInterval);
              this.pollInterval = null;
            }
          } else if (this.attempts() >= this.maxAttempts) {
            this.result.set(response);
            this.loading.set(false);
            if (this.pollInterval) {
              clearInterval(this.pollInterval);
              this.pollInterval = null;
            }
          }
        },
        error: () => {
          if (this.attempts() >= this.maxAttempts) {
            this.loading.set(false);
            this.error.set('Impossible de vérifier le statut du paiement. Consultez vos réservations.');
            if (this.pollInterval) {
              clearInterval(this.pollInterval);
              this.pollInterval = null;
            }
          }
        },
      });
    };

    // First check immediately
    check();

    // Then poll every 3 seconds
    this.pollInterval = setInterval(check, 3000);
  }
}
