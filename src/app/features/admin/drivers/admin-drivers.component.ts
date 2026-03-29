import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../../core/services/driver.service';
import { DriverResponse, DriverRequest } from '../../../core/models/driver.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-drivers',
  imports: [FormsModule, StatusBadgeComponent],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Drivers Management</h1>
        <button (click)="openForm(null)"
          class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
          + Add Driver
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">License</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (driver of drivers(); track driver.id) {
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium">{{ driver.firstName }} {{ driver.lastName }}</td>
                <td class="px-4 py-3 font-mono text-sm">{{ driver.licenseNumber }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ driver.phone }}</td>
                <td class="px-4 py-3"><app-status-badge [status]="driver.status" /></td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button (click)="openForm(driver)"
                      class="px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded text-xs font-medium">
                      Edit
                    </button>
                    <button (click)="delete(driver.id)"
                      class="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="px-4 py-12 text-center text-gray-400">No drivers found</td></tr>
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

    <!-- Form Modal -->
    @if (showForm()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
          <h3 class="text-lg font-bold mb-4">{{ editId() ? 'Edit Driver' : 'Add Driver' }}</h3>
          <form (ngSubmit)="submit()" #driverForm="ngForm">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                <input type="text" name="firstName" [(ngModel)]="form.firstName" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                <input type="text" name="lastName" [(ngModel)]="form.lastName" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">License Number</label>
                <input type="text" name="licenseNumber" [(ngModel)]="form.licenseNumber" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input type="text" name="phone" [(ngModel)]="form.phone" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Email (optional)</label>
                <input type="email" name="email" [(ngModel)]="form.email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              @if (editId()) {
                <div class="col-span-2">
                  <label class="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select name="status" [(ngModel)]="form.status"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_MISSION">On Mission</option>
                    <option value="ON_LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              }
            </div>
            <div class="flex gap-3 mt-4">
              <button type="submit" [disabled]="!driverForm.form.valid"
                class="flex-1 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium transition-colors">
                {{ editId() ? 'Update' : 'Add' }} Driver
              </button>
              <button type="button" (click)="showForm.set(false)"
                class="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class AdminDriversComponent implements OnInit {
  private driverService = inject(DriverService);

  drivers = signal<DriverResponse[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  showForm = signal(false);
  editId = signal<number | null>(null);
  form: DriverRequest = { firstName: '', lastName: '', licenseNumber: '', phone: '', email: '', status: 'AVAILABLE' };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.driverService.getAll(this.currentPage(), 10).subscribe({
      next: page => { this.drivers.set(page.content); this.totalPages.set(page.totalPages); },
    });
  }

  changePage(page: number): void { this.currentPage.set(page); this.load(); }

  openForm(driver: DriverResponse | null): void {
    if (driver) {
      this.editId.set(driver.id);
      this.form = { firstName: driver.firstName, lastName: driver.lastName, licenseNumber: driver.licenseNumber, phone: driver.phone, email: driver.email ?? '', status: driver.status };
    } else {
      this.editId.set(null);
      this.form = { firstName: '', lastName: '', licenseNumber: '', phone: '', email: '', status: 'AVAILABLE' };
    }
    this.showForm.set(true);
  }

  submit(): void {
    const id = this.editId();
    const obs = id ? this.driverService.update(id, this.form) : this.driverService.create(this.form);
    obs.subscribe({ next: () => { this.showForm.set(false); this.load(); } });
  }

  delete(id: number): void {
    if (confirm('Delete this driver?')) {
      this.driverService.delete(id).subscribe({ next: () => this.load() });
    }
  }
}
