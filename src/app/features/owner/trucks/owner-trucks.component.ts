import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TruckService } from '../../../core/services/truck.service';
import { AuthService } from '../../../core/services/auth.service';
import { TruckResponse, TruckRequest } from '../../../core/models/truck.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

interface TruckFormData extends TruckRequest {
  pricePerDay?: number;
}

@Component({
  selector: 'app-owner-trucks',
  imports: [FormsModule, StatusBadgeComponent],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Mes camions</h1>
          <p class="text-gray-500 text-sm mt-1">Gérez votre flotte et suivez le statut de validation</p>
        </div>
        <button (click)="openForm()"
          class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          + Soumettre un camion
        </button>
      </div>

      @if (notification(); as notif) {
        <div [class]="'mb-4 p-3 rounded-lg text-sm ' + (notif.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : notif.type === 'warning' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-red-50 text-red-700 border border-red-200')">
          {{ notif.message }}
        </div>
      }

      <!-- Stats summary -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div class="text-2xl font-bold text-gray-900">{{ totalTrucks() }}</div>
          <div class="text-sm text-gray-500">Total camions</div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div class="text-2xl font-bold text-green-600">{{ availableTrucks() }}</div>
          <div class="text-sm text-gray-500">Disponibles</div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ pendingTrucks() }}</div>
          <div class="text-sm text-gray-500">En attente</div>
        </div>
      </div>

      <!-- Truck cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (truck of myTrucks(); track truck.id) {
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="font-bold font-mono text-lg">{{ truck.licensePlate }}</p>
                <p class="text-gray-600 text-sm">{{ truck.brand }} {{ truck.model }}</p>
              </div>
              <app-status-badge [status]="truck.status" />
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>🚛 {{ truck.capacityTons }} tonnes</div>
              <div>📅 {{ truck.year }}</div>
            </div>
            @if (truck.rejectionReason) {
              <div class="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <strong>Refusé :</strong> {{ truck.rejectionReason }}
              </div>
            }
          </div>
        } @empty {
          <div class="col-span-3 py-16 text-center text-gray-400">
            <div class="text-4xl mb-3">🚛</div>
            <p class="text-lg font-medium">Aucun camion</p>
            <p class="text-sm">Soumettez votre premier camion pour validation</p>
          </div>
        }
      </div>
    </div>

    <!-- Add Truck Modal -->
    @if (showForm()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
          <div class="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <h3 class="text-lg font-bold text-gray-900 mb-1">Soumettre un camion</h3>
            <p class="text-sm text-gray-500">Votre camion sera examiné par un administrateur</p>
          </div>
          <form (ngSubmit)="submit()" #truckForm="ngForm" class="p-6 overflow-y-auto flex-1">

            <!-- Section: Informations -->
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Informations</h4>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Immatriculation *</label>
                <input type="text" name="licensePlate" [(ngModel)]="form.licensePlate" required
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. AA-123-BB" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Marque *</label>
                <input type="text" name="brand" [(ngModel)]="form.brand" required
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. Volvo" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Modèle *</label>
                <input type="text" name="model" [(ngModel)]="form.model" required
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. FH16" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Année *</label>
                <input type="number" name="year" [(ngModel)]="form.year" required min="1990" max="2030"
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Prix / jour (FCFA) *</label>
                <input type="number" name="pricePerDay" [(ngModel)]="form.pricePerDay" required min="1" step="1000"
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. 50000" />
              </div>
            </div>

            <!-- Section: Caractéristiques -->
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Caractéristiques</h4>
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Capacité (tonnes) *</label>
                <input type="number" name="capacityTons" [(ngModel)]="form.capacityTons" required min="0.5" step="0.5"
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Puissance (ch)</label>
                <input type="number" name="horsepower" [(ngModel)]="form.horsepower" min="1" max="2000"
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. 460" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Transmission</label>
                <select name="transmission" [(ngModel)]="form.transmission"
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">—</option>
                  <option value="MANUAL">Manuelle</option>
                  <option value="AUTOMATIC">Automatique</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Carburant</label>
                <select name="fuel" [(ngModel)]="form.fuel"
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">—</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="GASOLINE">Essence</option>
                  <option value="ELECTRIC">Électrique</option>
                  <option value="HYBRID">Hybride</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Nombre de sièges</label>
                <input type="number" name="seats" [(ngModel)]="form.seats" min="1" max="10"
                  class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ex. 2" />
              </div>
            </div>

            <!-- Section: Équipements -->
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Équipements</h4>
            <div class="grid grid-cols-2 gap-2 mb-4">
              <label class="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="airConditioning" [(ngModel)]="form.airConditioning" class="w-4 h-4 text-orange-500" />
                Climatisation
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="gps" [(ngModel)]="form.gps" class="w-4 h-4 text-orange-500" />
                GPS
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="bluetooth" [(ngModel)]="form.bluetooth" class="w-4 h-4 text-orange-500" />
                Bluetooth
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="cruiseControl" [(ngModel)]="form.cruiseControl" class="w-4 h-4 text-orange-500" />
                Régulateur de vitesse
              </label>
              <label class="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" name="parkingSensors" [(ngModel)]="form.parkingSensors" class="w-4 h-4 text-orange-500" />
                Capteurs de stationnement
              </label>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea name="description" [(ngModel)]="form.description" rows="3" maxlength="5000"
                class="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                placeholder="Décrivez votre camion, son état, ses particularités..."></textarea>
            </div>

            <!-- Section: Photos -->
            <h4 class="text-sm font-bold text-gray-800 uppercase tracking-wide mb-2">Photos</h4>
            <div class="mb-4">
              <input type="file" multiple accept="image/*" (change)="onFileSelect($event)"
                class="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100" />
              @if (selectedFiles().length > 0) {
                <div class="mt-3 grid grid-cols-4 gap-2">
                  @for (preview of previews(); track preview.name; let i = $index) {
                    <div class="relative">
                      <img [src]="preview.url" [alt]="preview.name" class="w-full h-20 object-cover rounded-lg border border-gray-200" />
                      <button type="button" (click)="removeFile(i)"
                        class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600">×</button>
                    </div>
                  }
                </div>
                <p class="text-xs text-gray-500 mt-2">{{ selectedFiles().length }} photo(s) sélectionnée(s)</p>
              } @else {
                <p class="text-xs text-gray-500 mt-2">Ajoutez au moins une photo pour améliorer la visibilité de votre annonce</p>
              }
            </div>

            <div class="flex gap-3 mt-5">
              <button type="submit" [disabled]="!truckForm.form.valid || submitting()"
                class="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white disabled:text-white rounded-lg font-semibold transition-colors">
                @if (submitting()) { Envoi en cours... } @else { Soumettre pour validation }
              </button>
              <button type="button" (click)="showForm.set(false)" [disabled]="submitting()"
                class="flex-1 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class OwnerTrucksComponent implements OnInit {
  private truckService = inject(TruckService);
  private authService = inject(AuthService);

  allTrucks = signal<TruckResponse[]>([]);
  showForm = signal(false);
  submitting = signal(false);
  selectedFiles = signal<File[]>([]);
  previews = signal<{ name: string; url: string }[]>([]);
  notification = signal<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);

  form: TruckFormData = this.emptyForm();

  myTrucks = computed(() => {
    const username = this.authService.currentUser()?.username ?? '';
    return this.allTrucks().filter(t => t.ownerUsername === username);
  });

  totalTrucks = computed(() => this.myTrucks().length);
  availableTrucks = computed(() => this.myTrucks().filter(t => t.status === 'AVAILABLE').length);
  pendingTrucks = computed(() => this.myTrucks().filter(t => t.status === 'PENDING_VALIDATION').length);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.truckService.getMy(0, 100).subscribe({
      next: page => this.allTrucks.set(page.content),
    });
  }

  openForm(): void {
    this.form = this.emptyForm();
    this.selectedFiles.set([]);
    this.previews.set([]);
    this.showForm.set(true);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    this.selectedFiles.set(files);
    this.previews.set(files.map(f => ({ name: f.name, url: URL.createObjectURL(f) })));
  }

  removeFile(index: number): void {
    const files = [...this.selectedFiles()];
    const prevs = [...this.previews()];
    URL.revokeObjectURL(prevs[index].url);
    files.splice(index, 1);
    prevs.splice(index, 1);
    this.selectedFiles.set(files);
    this.previews.set(prevs);
  }

  submit(): void {
    this.submitting.set(true);
    this.notification.set(null);
    this.truckService.create(this.form).subscribe({
      next: created => {
        const files = this.selectedFiles();
        if (files.length === 0) {
          this.finishSubmit('success', 'Camion soumis pour validation.');
          return;
        }
        this.truckService.uploadPhotos(created.id, files).subscribe({
          next: () => this.finishSubmit('success', `Camion soumis avec ${files.length} photo(s).`),
          error: err => this.finishSubmit('warning', `Camion créé mais échec de l'upload des photos : ${err?.error?.message ?? err?.message ?? 'erreur inconnue'}`),
        });
      },
      error: err => {
        this.submitting.set(false);
        this.notification.set({ type: 'error', message: 'Échec de la soumission : ' + (err?.error?.message ?? err?.message ?? 'erreur inconnue') });
        setTimeout(() => this.notification.set(null), 8000);
      },
    });
  }

  private finishSubmit(type: 'success' | 'warning', message: string): void {
    this.submitting.set(false);
    this.showForm.set(false);
    this.form = this.emptyForm();
    this.selectedFiles.set([]);
    this.previews().forEach(p => URL.revokeObjectURL(p.url));
    this.previews.set([]);
    this.notification.set({ type, message });
    setTimeout(() => this.notification.set(null), 6000);
    this.load();
  }

  private emptyForm(): TruckFormData {
    return {
      licensePlate: '',
      brand: '',
      model: '',
      capacityTons: 5,
      year: new Date().getFullYear(),
      pricePerDay: undefined,
      transmission: '',
      fuel: '',
      horsepower: undefined,
      seats: undefined,
      description: '',
      airConditioning: false,
      gps: false,
      bluetooth: false,
      cruiseControl: false,
      parkingSensors: false,
    };
  }
}
