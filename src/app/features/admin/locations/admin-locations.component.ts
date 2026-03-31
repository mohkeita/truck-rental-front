import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../../core/services/location.service';
import { LocationResponse, LocationRequest } from '../../../core/models/location.model';

@Component({
  selector: 'app-admin-locations',
  imports: [FormsModule],
  template: `
    <div class="animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-heading font-bold text-gradient uppercase">Locations</h1>
          <p class="text-muted-foreground text-sm mt-1">Manage pickup and return locations</p>
        </div>
        <button (click)="openAddModal()"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium font-heading uppercase tracking-wide hover:bg-primary/90 transition-colors">
          <span>+</span> Add Location
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (loc of locations(); track loc.id) {
          <div class="glass-card rounded-xl p-5">
            <div class="flex items-start justify-between mb-3">
              <div>
                <h3 class="font-bold text-foreground text-lg">{{ loc.name }}</h3>
                <p class="text-sm text-muted-foreground">{{ loc.city }}</p>
              </div>
              <span [class]="loc.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">
                {{ loc.active ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <div class="space-y-1 text-sm text-muted-foreground mb-4">
              <p>{{ loc.address }}</p>
              @if (loc.phone) { <p>{{ loc.phone }}</p> }
              @if (loc.email) { <p>{{ loc.email }}</p> }
              @if (loc.openingHours) { <p>{{ loc.openingHours }}</p> }
            </div>

            <div class="flex gap-2">
              <button (click)="openEditModal(loc)"
                class="flex-1 py-2 rounded-md bg-secondary text-foreground text-sm hover:bg-muted transition-colors">
                Edit
              </button>
              @if (loc.active) {
                <button (click)="deactivate(loc.id)"
                  class="flex-1 py-2 rounded-md bg-destructive/20 text-destructive text-sm hover:bg-destructive/30 transition-colors">
                  Deactivate
                </button>
              }
            </div>
          </div>
        } @empty {
          <div class="col-span-3 py-16 text-center text-muted-foreground">
            <div class="text-4xl mb-3">📍</div>
            <p class="text-lg font-medium">No locations yet</p>
            <p class="text-sm">Add your first pickup/return location</p>
          </div>
        }
      </div>

      <!-- Add/Edit Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" (click)="showModal.set(false)">
          <div class="glass-card rounded-xl p-6 w-full max-w-lg" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-heading font-bold text-foreground uppercase mb-4">
              {{ editingId() ? 'Edit Location' : 'Add Location' }}
            </h3>
            <form (ngSubmit)="submitForm()" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-muted-foreground mb-1">Name</label>
                <input [(ngModel)]="form.name" name="name" required
                  class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">City</label>
                  <input [(ngModel)]="form.city" name="city" required
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
                  <input [(ngModel)]="form.phone" name="phone"
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-muted-foreground mb-1">Address</label>
                <input [(ngModel)]="form.address" name="address" required
                  class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <input [(ngModel)]="form.email" name="email" type="email"
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Opening Hours</label>
                  <input [(ngModel)]="form.openingHours" name="openingHours" placeholder="Mon-Fri 8:00-18:00"
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div class="flex gap-3 justify-end pt-2">
                <button type="button" (click)="showModal.set(false)"
                  class="px-4 py-2 rounded-md border border-border text-foreground text-sm hover:bg-muted transition-colors">Cancel</button>
                <button type="submit"
                  class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  {{ editingId() ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminLocationsComponent implements OnInit {
  private locationService = inject(LocationService);

  locations = signal<LocationResponse[]>([]);
  showModal = signal(false);
  editingId = signal<number | null>(null);
  form: LocationRequest = { name: '', city: '', address: '' };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.locationService.getAll().subscribe({
      next: (data) => this.locations.set(data),
    });
  }

  openAddModal(): void {
    this.form = { name: '', city: '', address: '' };
    this.editingId.set(null);
    this.showModal.set(true);
  }

  openEditModal(loc: LocationResponse): void {
    this.form = {
      name: loc.name,
      city: loc.city,
      address: loc.address,
      phone: loc.phone,
      email: loc.email,
      openingHours: loc.openingHours,
    };
    this.editingId.set(loc.id);
    this.showModal.set(true);
  }

  submitForm(): void {
    const id = this.editingId();
    const obs = id
      ? this.locationService.update(id, this.form)
      : this.locationService.create(this.form);

    obs.subscribe({
      next: () => { this.showModal.set(false); this.load(); },
    });
  }

  deactivate(id: number): void {
    this.locationService.delete(id).subscribe({ next: () => this.load() });
  }
}
