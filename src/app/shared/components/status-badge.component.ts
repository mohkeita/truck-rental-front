import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span [class]="badgeClass()" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border">
      {{ label() }}
    </span>
  `,
})
export class StatusBadgeComponent {
  status = input.required<string>();

  label = computed(() => this.status().replace(/_/g, ' '));

  badgeClass = computed(() => {
    switch (this.status()) {
      case 'AVAILABLE':
      case 'ACTIVE':
      case 'COMPLETED':
      case 'PAID':
        return 'bg-success/20 text-success border-success/30';
      case 'PENDING_VALIDATION':
      case 'PENDING':
      case 'PLANNED':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'ON_MISSION':
      case 'IN_PROGRESS':
        return 'bg-info/20 text-info border-info/30';
      case 'MAINTENANCE':
      case 'ON_LEAVE':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'OUT_OF_SERVICE':
      case 'REJECTED':
      case 'CANCELLED':
      case 'OVERDUE':
      case 'INACTIVE':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  });
}
