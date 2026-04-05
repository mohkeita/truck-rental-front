import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <div class="animate-fade-in">
      <!-- Hero -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="max-w-3xl">
          <span class="badge-label">Notre histoire</span>
          <h1 class="section-title mt-4">&Agrave; PROPOS DE <span class="text-primary">TRUCKRENTAL</span></h1>
          <p class="text-lg text-muted-foreground mt-4 max-w-2xl">
            Depuis notre cr&eacute;ation, nous accompagnons les entreprises et particuliers guin&eacute;ens
            dans leurs besoins de transport avec une flotte fiable et un service d'exception.
          </p>
        </div>
      </section>

      <!-- Expertise -->
      <section class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span class="badge-label">Notre parcours</span>
              <h2 class="section-title mt-4">UNE EXPERTISE FORG&Eacute;E <span class="text-primary">SUR LE TERRAIN</span></h2>
              <p class="text-muted-foreground mt-4 leading-relaxed">
                TruckRental est n&eacute; d'un constat simple&nbsp;: le march&eacute; guin&eacute;en manquait
                d'une solution fiable et professionnelle de location de camions. Fond&eacute;e pour r&eacute;pondre
                &agrave; la demande croissante de v&eacute;hicules de transport de qualit&eacute;, notre entreprise
                a d&eacute;marr&eacute; avec une petite flotte et une grande ambition.
              </p>
              <p class="text-muted-foreground mt-4 leading-relaxed">
                Au fil des ann&eacute;es, nous avons &eacute;largi notre parc de v&eacute;hicules, renforc&eacute;
                nos &eacute;quipes et d&eacute;velopp&eacute; des partenariats strat&eacute;giques dans tout le pays.
                Aujourd'hui, TruckRental est un acteur incontournable de la logistique en Guin&eacute;e, reconnu
                pour la qualit&eacute; de ses v&eacute;hicules et l'excellence de son service client.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="glass-card rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-primary font-heading">200+</div>
                <div class="text-sm text-muted-foreground mt-1">Camions</div>
              </div>
              <div class="glass-card rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-primary font-heading">50+</div>
                <div class="text-sm text-muted-foreground mt-1">Partenaires</div>
              </div>
              <div class="glass-card rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-primary font-heading">10 000+</div>
                <div class="text-sm text-muted-foreground mt-1">Missions r&eacute;alis&eacute;es</div>
              </div>
              <div class="glass-card rounded-xl p-6 text-center">
                <div class="text-3xl font-bold text-primary font-heading">8+</div>
                <div class="text-sm text-muted-foreground mt-1">Ann&eacute;es d'exp&eacute;rience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section class="py-16 border-y border-border bg-card/30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <span class="badge-label">Nos valeurs</span>
            <h2 class="section-title mt-4">CE QUI NOUS <span class="text-primary">DISTINGUE</span></h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Excellence -->
            <div class="glass-card rounded-xl p-6">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg class="text-primary w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 class="font-bold text-foreground mb-2">Excellence op&eacute;rationnelle</h3>
              <p class="text-sm text-muted-foreground">
                Chaque v&eacute;hicule est inspect&eacute; et entretenu selon des standards rigoureux
                pour garantir fiabilit&eacute; et s&eacute;curit&eacute;.
              </p>
            </div>
            <!-- Satisfaction -->
            <div class="glass-card rounded-xl p-6">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg class="text-primary w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 class="font-bold text-foreground mb-2">Satisfaction client</h3>
              <p class="text-sm text-muted-foreground">
                Notre priorit&eacute; absolue est votre r&eacute;ussite. Un service r&eacute;actif,
                disponible 24h/24 et 7j/7.
              </p>
            </div>
            <!-- Durable -->
            <div class="glass-card rounded-xl p-6">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg class="text-primary w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 class="font-bold text-foreground mb-2">Engagement durable</h3>
              <p class="text-sm text-muted-foreground">
                Nous investissons dans des v&eacute;hicules modernes et &eacute;conomes pour r&eacute;duire
                notre empreinte environnementale.
              </p>
            </div>
            <!-- Expertise -->
            <div class="glass-card rounded-xl p-6">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <svg class="text-primary w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 class="font-bold text-foreground mb-2">Expertise reconnue</h3>
              <p class="text-sm text-muted-foreground">
                Plus de 8 ans d'exp&eacute;rience dans le transport et la logistique en Guin&eacute;e.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-12">
            <span class="badge-label">&Eacute;quipe</span>
            <h2 class="section-title mt-4">NOTRE <span class="text-primary">&Eacute;QUIPE</span></h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Bangaly Camara -->
            <div class="glass-card rounded-xl p-6 text-center">
              <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="text-xl font-bold text-primary font-heading">BC</span>
              </div>
              <h3 class="font-bold text-foreground">Bangaly Camara</h3>
              <p class="text-sm text-primary">Directeur G&eacute;n&eacute;ral</p>
              <p class="text-sm text-muted-foreground mt-2">
                Visionnaire et entrepreneur, Bangaly dirige TruckRental avec passion depuis sa cr&eacute;ation.
              </p>
            </div>
            <!-- Aminata Diallo -->
            <div class="glass-card rounded-xl p-6 text-center">
              <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="text-xl font-bold text-primary font-heading">AD</span>
              </div>
              <h3 class="font-bold text-foreground">Aminata Diallo</h3>
              <p class="text-sm text-primary">Directrice des Op&eacute;rations</p>
              <p class="text-sm text-muted-foreground mt-2">
                Sp&eacute;cialiste de la logistique, Aminata supervise l'ensemble de notre flotte et nos op&eacute;rations.
              </p>
            </div>
            <!-- Ibrahim Sylla -->
            <div class="glass-card rounded-xl p-6 text-center">
              <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="text-xl font-bold text-primary font-heading">IS</span>
              </div>
              <h3 class="font-bold text-foreground">Ibrahim Sylla</h3>
              <p class="text-sm text-primary">Responsable Commercial</p>
              <p class="text-sm text-muted-foreground mt-2">
                Expert du march&eacute; guin&eacute;en, Ibrahim accompagne nos clients dans le choix de leurs solutions.
              </p>
            </div>
            <!-- Fatoumata Barry -->
            <div class="glass-card rounded-xl p-6 text-center">
              <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span class="text-xl font-bold text-primary font-heading">FB</span>
              </div>
              <h3 class="font-bold text-foreground">Fatoumata Barry</h3>
              <p class="text-sm text-primary">Responsable Client&egrave;le</p>
              <p class="text-sm text-muted-foreground mt-2">
                D&eacute;vou&eacute;e et &agrave; l'&eacute;coute, Fatoumata assure une exp&eacute;rience client irr&eacute;prochable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-16 border-t border-border">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 class="section-title">PR&Ecirc;T &Agrave; TRAVAILLER <span class="text-primary">ENSEMBLE</span> ?</h2>
          <p class="text-muted-foreground mt-4 mb-8 max-w-md mx-auto">
            Que vous soyez une entreprise ou un particulier, notre &eacute;quipe est pr&ecirc;te
            &agrave; vous accompagner dans tous vos projets de transport.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a routerLink="/contact" class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Nous contacter
            </a>
            <a routerLink="/trucks" class="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
              Explorer le catalogue
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class AboutComponent {}
