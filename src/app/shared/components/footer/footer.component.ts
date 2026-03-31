import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="bg-sidebar border-t border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl">🚛</span>
              <span class="text-xl font-bold text-foreground font-heading">TruckRental</span>
            </div>
            <p class="text-sm text-muted-foreground max-w-sm">
              Votre partenaire de confiance pour la location de camions. Parcourez notre flotte et trouvez le véhicule idéal.
            </p>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-foreground mb-4">Liens rapides</h3>
            <ul class="space-y-2">
              <li><a routerLink="/" class="text-sm text-muted-foreground hover:text-primary transition-colors">Accueil</a></li>
              <li><a routerLink="/trucks" class="text-sm text-muted-foreground hover:text-primary transition-colors">Voir les camions</a></li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-foreground mb-4">Contact</h3>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>support&#64;truckrental.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Support client 24h/24</li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          &copy; 2026 TruckRental. Tous droits réservés.
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
