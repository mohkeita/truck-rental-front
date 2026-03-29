import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <div class="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border border-gray-100">
      <div class="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
           [class]="iconBg()">
        {{ icon() }}
      </div>
      <div>
        <p class="text-2xl font-bold text-gray-900">{{ value() }}</p>
        <p class="text-sm text-gray-500">{{ label() }}</p>
      </div>
    </div>
  `,
})
export class StatCardComponent {
  icon = input.required<string>();
  value = input.required<string | number>();
  label = input.required<string>();
  iconBg = input<string>('bg-blue-50');
}