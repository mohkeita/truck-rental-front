import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <span [class]="badgeClass()">{{ label() }}</span>
  `,
})
export class StatusBadgeComponent {
  status = input.required<string>();

  label = computed(() => this.status().replace(/_/g, ' '));

  badgeClass = computed(() => {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const s = this.status();
    switch (s) {
      case 'AVAILABLE':
      case 'ACTIVE':
      case 'COMPLETED':
      case 'PAID':
        return `${base} bg-green-100 text-green-800`;
      case 'PENDING_VALIDATION':
      case 'PENDING':
      case 'PLANNED':
        return `${base} bg-yellow-100 text-yellow-800`;
      case 'ON_MISSION':
      case 'IN_PROGRESS':
        return `${base} bg-blue-100 text-blue-800`;
      case 'MAINTENANCE':
      case 'ON_LEAVE':
        return `${base} bg-orange-100 text-orange-800`;
      case 'OUT_OF_SERVICE':
      case 'REJECTED':
      case 'CANCELLED':
      case 'OVERDUE':
      case 'INACTIVE':
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-gray-100 text-gray-800`;
    }
  });
}
