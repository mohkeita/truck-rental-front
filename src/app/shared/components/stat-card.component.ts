import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="glass-card rounded-xl p-5 animate-fade-in flex items-start gap-4">
      <div [class]="iconWrapperClass()" class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 glow-amber">
        {{ icon() }}
      </div>
      <div>
        <div class="text-2xl font-heading font-bold text-foreground">{{ value() }}</div>
        <div class="text-sm text-muted-foreground mt-0.5">{{ label() }}</div>
      </div>
    </div>
  `,
})
export class StatCardComponent {
  icon = input.required<string>();
  value = input.required<string | number>();
  label = input.required<string>();
  iconBg = input<string>('bg-primary/10');

  iconWrapperClass = computed(() => this.iconBg());
}
