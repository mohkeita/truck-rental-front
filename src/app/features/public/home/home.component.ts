import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse } from '../../../core/models/truck.model';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="animate-fade-in">
      <!-- Hero -->
      <section class="relative py-20 lg:py-32 overflow-hidden">
        <div class="absolute inset-0 hero-pattern opacity-40"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div class="max-w-3xl">
            <span class="badge-label mb-6 inline-flex">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Leader de la location en Guin&eacute;e
            </span>
            <h1 class="text-4xl lg:text-6xl font-heading font-bold text-foreground uppercase leading-tight mb-6">
              Location de <span class="text-primary">camions</span> professionnels
            </h1>
            <p class="text-lg text-muted-foreground mb-8 max-w-xl">
              Parcourez notre flotte de camions de qualit&eacute;, du v&eacute;hicule utilitaire au poids lourd. Tarifs transparents, dur&eacute;es flexibles et service fiable en Guin&eacute;e.
            </p>
            <div class="flex flex-wrap gap-4 mb-10">
              <a routerLink="/trucks" class="px-7 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors glow-amber inline-flex items-center gap-2">
                Explorer le catalogue
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
              <a routerLink="/contact" class="px-7 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                Demande sur mesure
              </a>
            </div>

            <!-- Feature badges -->
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <svg class="w-5 h-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Livraison sur site
              </div>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <svg class="w-5 h-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Chauffeur disponible
              </div>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <svg class="w-5 h-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                Contrat flexible
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="py-14 border-y border-border bg-card/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-primary font-heading">200+</div>
              <div class="text-sm text-muted-foreground mt-1">Camions disponibles</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-primary font-heading">50+</div>
              <div class="text-sm text-muted-foreground mt-1">Partenaires actifs</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-primary font-heading">10K+</div>
              <div class="text-sm text-muted-foreground mt-1">Missions r&eacute;alis&eacute;es</div>
            </div>
            <div class="text-center">
              <div class="text-3xl lg:text-4xl font-bold text-primary font-heading">24/7</div>
              <div class="text-sm text-muted-foreground mt-1">Support client</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us -->
      <section class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <span class="badge-label">Nos engagements</span>
            <h2 class="section-title mt-4">POURQUOI CHOISIR <span class="text-primary">TRUCKRENTAL</span> ?</h2>
            <p class="text-muted-foreground mt-3 max-w-xl mx-auto">Des solutions de transport adapt&eacute;es &agrave; chaque besoin, avec un engagement qualit&eacute; sans compromis.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Card 1 -->
            <div class="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5"/><path d="M15 7v4h5"/>
                </svg>
              </div>
              <h3 class="font-bold text-foreground text-lg mb-2">Flotte moderne</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">V&eacute;hicules r&eacute;cents et r&eacute;guli&egrave;rement entretenus pour garantir fiabilit&eacute; et performance sur tous vos chantiers.</p>
            </div>
            <!-- Card 2 -->
            <div class="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 class="font-bold text-foreground text-lg mb-2">Assurance incluse</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Chaque location inclut une assurance compl&egrave;te pour vous permettre de travailler l'esprit tranquille.</p>
            </div>
            <!-- Card 3 -->
            <div class="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3 class="font-bold text-foreground text-lg mb-2">Disponibilit&eacute; 24/7</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Notre &eacute;quipe d'assistance est disponible jour et nuit pour r&eacute;pondre &agrave; vos urgences et vos demandes.</p>
            </div>
            <!-- Card 4 -->
            <div class="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h3 class="font-bold text-foreground text-lg mb-2">Maintenance garantie</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">Un suivi technique rigoureux et un remplacement rapide en cas de panne pour z&eacute;ro interruption de vos op&eacute;rations.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Trucks -->
      <section class="py-16 lg:py-24 border-y border-border bg-card/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-end justify-between mb-10">
            <div>
              <span class="badge-label">S&eacute;lection</span>
              <h2 class="section-title mt-4">CAMIONS <span class="text-primary">EN VEDETTE</span></h2>
            </div>
            <a routerLink="/trucks" class="text-sm text-primary hover:underline hidden sm:inline-flex items-center gap-1">
              Voir tout le catalogue
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>

          @if (trucks().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (truck of trucks(); track truck.id) {
                <a [routerLink]="['/trucks', truck.id]" class="glass-card rounded-xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer">
                  <div class="relative h-48 w-full overflow-hidden">
                    @if (truck.photoUrls?.length) {
                      <img [src]="apiUrl + truck.photoUrls![0]" [alt]="truck.brand + ' ' + truck.model"
                        class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    } @else {
                      <div class="h-full w-full bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
                        <svg class="w-16 h-16 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                          <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5"/>
                          <path d="M15 7v4h5"/>
                        </svg>
                      </div>
                    }
                    <span class="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/90 text-white backdrop-blur-sm">
                      Disponible
                    </span>
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span class="text-white font-bold text-lg font-heading">{{ truck.brand }}</span>
                    </div>
                  </div>
                  <div class="p-5">
                    <h3 class="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{{ truck.brand }} {{ truck.model }}</h3>

                    @if (truck.pricePerDay) {
                      <p class="text-xl font-bold text-primary mt-1">{{ truck.pricePerDay | number:'1.0-0' }} GNF<span class="text-sm font-normal text-muted-foreground">/jour</span></p>
                    }

                    <div class="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                        <span>{{ truck.capacityTons }}t</span>
                      </div>
                      @if (truck.fuel) {
                        <div class="flex items-center gap-1.5">
                          <svg class="w-4 h-4 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22V6l7-4 7 4v16"/><path d="M10 2v4"/><path d="M17 6l4 2v8l-4 2"/></svg>
                          <span>{{ truck.fuel }}</span>
                        </div>
                      }
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>{{ truck.year }}</span>
                      </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-border">
                      <span class="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Voir d&eacute;tails
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </span>
                    </div>
                  </div>
                </a>
              }
            </div>
            <div class="mt-8 text-center sm:hidden">
              <a routerLink="/trucks" class="text-sm text-primary hover:underline inline-flex items-center gap-1">
                Voir tous les camions
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          } @else if (loadError()) {
            <div class="glass-card rounded-xl p-12 text-center">
              <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold text-foreground mb-2">Connectez-vous pour voir les camions</h3>
              <p class="text-sm text-muted-foreground mb-4">Cr&eacute;ez un compte gratuit pour d&eacute;couvrir notre flotte</p>
              <div class="flex justify-center gap-3">
                <button (click)="login()" class="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Connexion
                </button>
                <button (click)="register()" class="px-6 py-2.5 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                  S'inscrire
                </button>
              </div>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (i of [1,2,3]; track i) {
                <div class="glass-card rounded-xl overflow-hidden animate-pulse">
                  <div class="h-48 bg-muted"></div>
                  <div class="p-5">
                    <div class="h-5 bg-muted rounded w-3/4 mb-3"></div>
                    <div class="h-6 bg-muted rounded w-1/2 mb-3"></div>
                    <div class="h-4 bg-muted rounded w-full"></div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>

      <!-- How It Works -->
      <section class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <span class="badge-label">Processus</span>
            <h2 class="section-title mt-4">COMMENT &Ccedil;A <span class="text-primary">FONCTIONNE</span> ?</h2>
            <p class="text-muted-foreground mt-3">Louez un camion en 4 &eacute;tapes simples</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Step 1 -->
            <div class="text-center relative">
              <div class="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold font-heading">1</div>
              <h3 class="font-bold text-foreground mb-2">Choisissez votre camion</h3>
              <p class="text-sm text-muted-foreground">Parcourez notre catalogue et s&eacute;lectionnez le v&eacute;hicule adapt&eacute; &agrave; vos besoins</p>
              <div class="hidden lg:block absolute top-7 left-[60%] w-[80%] border-t border-dashed border-border"></div>
            </div>
            <!-- Step 2 -->
            <div class="text-center relative">
              <div class="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold font-heading">2</div>
              <h3 class="font-bold text-foreground mb-2">S&eacute;lectionnez vos dates</h3>
              <p class="text-sm text-muted-foreground">Indiquez la p&eacute;riode de location souhait&eacute;e et les options d&eacute;sir&eacute;es</p>
              <div class="hidden lg:block absolute top-7 left-[60%] w-[80%] border-t border-dashed border-border"></div>
            </div>
            <!-- Step 3 -->
            <div class="text-center relative">
              <div class="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold font-heading">3</div>
              <h3 class="font-bold text-foreground mb-2">Confirmez et payez</h3>
              <p class="text-sm text-muted-foreground">Validez votre r&eacute;servation et proc&eacute;dez au paiement s&eacute;curis&eacute;</p>
              <div class="hidden lg:block absolute top-7 left-[60%] w-[80%] border-t border-dashed border-border"></div>
            </div>
            <!-- Step 4 -->
            <div class="text-center">
              <div class="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold font-heading">4</div>
              <h3 class="font-bold text-foreground mb-2">R&eacute;ceptionnez le camion</h3>
              <p class="text-sm text-muted-foreground">R&eacute;cup&eacute;rez votre camion ou faites-vous livrer directement sur site</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-16 lg:py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="section-title mb-4">PR&Ecirc;T &Agrave; D&Eacute;MARRER <span class="text-primary">VOTRE PROJET</span> ?</h2>
          <p class="text-muted-foreground mb-8 max-w-lg mx-auto">Rejoignez des milliers de professionnels qui font confiance &agrave; TruckRental pour leurs besoins de transport en Guin&eacute;e.</p>
          <div class="flex flex-wrap justify-center gap-4">
            @if (!authService.isAuthenticated()) {
              <button (click)="register()" class="px-7 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors glow-amber inline-flex items-center gap-2">
                Cr&eacute;er un compte gratuit
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            } @else {
              <a routerLink="/trucks" class="px-7 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors glow-amber inline-flex items-center gap-2">
                Explorer le catalogue
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            }
            <a routerLink="/contact" class="px-7 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors inline-flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private truckService = inject(TruckService);
  authService = inject(AuthService);
  apiUrl = environment.apiUrl;

  trucks = signal<TruckResponse[]>([]);
  loadError = signal(false);

  ngOnInit() {
    this.truckService.getAvailable(0, 6).subscribe({
      next: page => this.trucks.set(page.content),
      error: () => this.loadError.set(true),
    });
  }

  login() { this.authService.login(); }
  register() { this.authService.register(); }
}
