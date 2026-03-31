import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    @if (isPublicRoute()) {
      <app-header />
      <main>
        <router-outlet />
      </main>
      <app-footer />
    } @else {
      <router-outlet />
    }
  `,
})
export class App {
  private router = inject(Router);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  isPublicRoute = computed(() => {
    const url = this.currentUrl();
    return !url.startsWith('/admin') && !url.startsWith('/owner') && !url.startsWith('/client');
  });
}
