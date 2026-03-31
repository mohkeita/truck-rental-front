import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../../core/services/driver.service';
import { DriverResponse, DriverRequest } from '../../../core/models/driver.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-drivers',
  standalone: true,
  imports: [FormsModule, StatusBadgeComponent],
  template: `
    <div class="animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-heading font-bold text-gradient uppercase">Drivers</h1>
          <p class="text-muted-foreground text-sm mt-1">Manage your driver roster</p>
        </div>
        <button (click)="openForm(null)"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium font-heading uppercase tracking-wide hover:bg-primary/90 transition-colors">
          <span>+</span> Add Driver
        </button>
      </div>

      <div class="glass-card rounded-xl overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Name</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">License</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Phone</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Status</th>
              <th class="text-right p-4 text-sm text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (driver of drivers(); track driver.id) {
              <tr class="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td class="p-4 text-foreground font-medium text-sm">{{ driver.firstName }} {{ driver.lastName }}</td>
                <td class="p-4 text-muted-foreground text-sm">{{ driver.licenseNumber }}</td>
                <td class="p-4 text-muted-foreground text-sm">{{ driver.phone }}</td>
                <td class="p-4"><app-status-badge [status]="driver.status" /></td>
                <td class="p-4">
                  <div class="flex items-center justify-end gap-1">
                    <button (click)="openForm(driver)"
                      class="h-8 px-3 rounded-md bg-secondary text-foreground text-xs hover:bg-muted transition-colors">
                      ✏️ Edit
                    </button>
                    <button (click)="deleteDriver(driver.id)"
                      class="h-8 px-3 rounded-md bg-destructive/20 text-destructive text-xs hover:bg-destructive/30 transition-colors">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="p-8 text-center text-muted-foreground text-sm">No drivers found</td></tr>
            }
          </tbody>
        </table>
        @if (totalPages() > 1) {
          <div class="flex items-center justify-between p-4 border-t border-border">
            <span class="text-sm text-muted-foreground">Page {{ currentPage() + 1 }} of {{ totalPages() }}</span>
            <div class="flex gap-2">
              <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                class="px-3 py-1.5 rounded-md bg-secondary text-foreground text-sm disabled:opacity-40 hover:bg-muted transition-colors">← Prev</button>
              <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                class="px-3 py-1.5 rounded-md bg-secondary text-foreground text-sm disabled:opacity-40 hover:bg-muted transition-colors">Next →</button>
            </div>
          </div>
        }
      </div>

      @if (showForm()) {
        <div class="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" (click)="showForm.set(false)">
          <div class="glass-card rounded-xl p-6 w-full max-w-md" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-heading font-bold text-foreground uppercase mb-4">{{ editId() ? 'Edit Driver' : 'Add Driver' }}</h3>
            <form (ngSubmit)="submit()" class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">First Name</label>
                  <input [(ngModel)]="form.firstName" name="firstName" required
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Last Name</label>
                  <input [(ngModel)]="form.lastName" name="lastName" required
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-muted-foreground mb-1">License Number</label>
                <input [(ngModel)]="form.licenseNumber" name="licenseNumber" required
                  class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
                  <input [(ngModel)]="form.phone" name="phone" required
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Email (optional)</label>
                  <input type="email" [(ngModel)]="form.email" name="email"
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              @if (editId()) {
                <div>
                  <label class="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                  <select [(ngModel)]="form.status" name="status"
                    class="w-full h-9 rounded-md border border-input bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_MISSION">On Mission</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              }
              <div class="flex gap-3 justify-end pt-2">
                <button type="button" (click)="showForm.set(false)"
                  class="px-4 py-2 rounded-md border border-border text-foreground text-sm hover:bg-muted transition-colors">Cancel</button>
                <button type="submit"
                  class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  {{ editId() ? 'Save Changes' : 'Add Driver' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminDriversComponent implements OnInit {
  drivers = signal<DriverResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  showForm = signal(false);
  editId = signal<number | null>(null);
  form: DriverRequest = { firstName: '', lastName: '', licenseNumber: '', phone: '', email: '', status: 'AVAILABLE' };

  constructor(private driverService: DriverService) {}

  ngOnInit() { this.load(); }

  load() {
    this.driverService.getAll(this.currentPage(), 10).subscribe({
      next: (page) => { this.drivers.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number) { this.currentPage.set(page); this.load(); }

  openForm(driver: DriverResponse | null) {
    if (driver) {
      this.editId.set(driver.id);
      this.form = { firstName: driver.firstName, lastName: driver.lastName, licenseNumber: driver.licenseNumber, phone: driver.phone, email: driver.email ?? '', status: driver.status };
    } else {
      this.editId.set(null);
      this.form = { firstName: '', lastName: '', licenseNumber: '', phone: '', email: '', status: 'AVAILABLE' };
    }
    this.showForm.set(true);
  }

  submit() {
    const id = this.editId();
    const obs = id ? this.driverService.update(id, this.form) : this.driverService.create(this.form);
    obs.subscribe({ next: () => { this.showForm.set(false); this.load(); } });
  }

  deleteDriver(id: number) {
    if (!confirm('Delete this driver?')) return;
    this.driverService.delete(id).subscribe({ next: () => this.load() });
  }
}
