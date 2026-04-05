import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="bg-sidebar border-t border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <!-- Col 1: Logo + description + socials -->
          <div>
            <div class="flex items-center gap-2.5 mb-4">
              <svg class="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5"/>
                <path d="M15 7v4h5"/>
              </svg>
              <div class="flex flex-col">
                <span class="text-lg font-bold text-foreground font-heading leading-none">TruckRental</span>
                <span class="text-[9px] font-semibold tracking-[0.2em] text-primary uppercase leading-none mt-0.5">Location de camions</span>
              </div>
            </div>
            <p class="text-sm text-muted-foreground mb-5 max-w-xs">
              Votre partenaire de confiance pour la location de camions professionnels en Guin&eacute;e. Flotte moderne, service fiable.
            </p>
            <!-- Social icons -->
            <div class="flex items-center gap-3">
              <a href="#" class="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" class="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          <!-- Col 2: Services -->
          <div>
            <h3 class="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Services</h3>
            <ul class="space-y-2.5">
              <li><a routerLink="/trucks" class="text-sm text-muted-foreground hover:text-primary transition-colors">Catalogue de camions</a></li>
              <li><a routerLink="/trucks" class="text-sm text-muted-foreground hover:text-primary transition-colors">Location de camions</a></li>
              <li><a routerLink="/contact" class="text-sm text-muted-foreground hover:text-primary transition-colors">Location avec chauffeur</a></li>
              <li><a routerLink="/contact" class="text-sm text-muted-foreground hover:text-primary transition-colors">Demande sur mesure</a></li>
            </ul>
          </div>

          <!-- Col 3: Entreprise -->
          <div>
            <h3 class="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Entreprise</h3>
            <ul class="space-y-2.5">
              <li><a routerLink="/about" class="text-sm text-muted-foreground hover:text-primary transition-colors">&Agrave; propos</a></li>
              <li><a routerLink="/faq" class="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
              <li><a routerLink="/contact" class="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              <li><a routerLink="/trucks" class="text-sm text-muted-foreground hover:text-primary transition-colors">Espace client</a></li>
            </ul>
          </div>

          <!-- Col 4: Contact -->
          <div>
            <h3 class="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Contact</h3>
            <ul class="space-y-3 text-sm text-muted-foreground">
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-primary mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Conakry, Guin&eacute;e</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-primary mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <span>+224 492 08 38 00</span>
              </li>
              <li class="flex items-start gap-2.5">
                <svg class="w-4 h-4 text-primary mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>support&#64;truckrental.com</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>&copy; 2026 TruckRental. Tous droits r&eacute;serv&eacute;s.</span>
          <div class="flex items-center gap-4">
            <a href="#" class="hover:text-foreground transition-colors">Mentions l&eacute;gales</a>
            <span class="text-border">|</span>
            <a href="#" class="hover:text-foreground transition-colors">CGU</a>
            <span class="text-border">|</span>
            <a href="#" class="hover:text-foreground transition-colors">Confidentialit&eacute;</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
