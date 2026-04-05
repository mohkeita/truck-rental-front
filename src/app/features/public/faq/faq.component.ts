import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">

      <!-- Header -->
      <div class="text-center mb-12">
        <span class="badge-label">FAQ</span>
        <h1 class="section-title mt-4">QUESTIONS <span class="text-primary">FR&Eacute;QUENTES</span></h1>
        <p class="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Retrouvez ici les r&eacute;ponses aux questions les plus pos&eacute;es par nos clients.
          Si vous ne trouvez pas votre r&eacute;ponse, n&rsquo;h&eacute;sitez pas &agrave; nous contacter.
        </p>
      </div>

      <!-- ============ SECTION : R&eacute;servation ============ -->
      <div class="glass-card rounded-xl p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <svg class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <h2 class="font-bold text-foreground uppercase text-sm tracking-wider">R&eacute;servation</h2>
        </div>

        <!-- Q1 -->
        <div class="border-b border-border">
          <button (click)="toggle('reservation', 0)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Comment r&eacute;server un camion&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openReservation() === 0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openReservation() === 0) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Parcourez notre catalogue, s&eacute;lectionnez un camion, choisissez vos dates et confirmez votre r&eacute;servation en ligne. C&rsquo;est simple et rapide.
            </div>
          }
        </div>

        <!-- Q2 -->
        <div class="border-b border-border">
          <button (click)="toggle('reservation', 1)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Quelle est la dur&eacute;e minimum de location&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openReservation() === 1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openReservation() === 1) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              La dur&eacute;e minimum est de 1 jour. Nous proposons des tarifs d&eacute;gressifs pour les locations longue dur&eacute;e (hebdomadaire et mensuel).
            </div>
          }
        </div>

        <!-- Q3 -->
        <div class="border-b border-border">
          <button (click)="toggle('reservation', 2)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Puis-je annuler ma r&eacute;servation&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openReservation() === 2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openReservation() === 2) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Oui, vous pouvez annuler gratuitement jusqu&rsquo;&agrave; 24h avant le d&eacute;but de la location. Au-del&agrave;, des frais d&rsquo;annulation peuvent s&rsquo;appliquer.
            </div>
          }
        </div>

        <!-- Q4 -->
        <div class="border-b border-border last:border-b-0">
          <button (click)="toggle('reservation', 3)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Faut-il un permis sp&eacute;cial&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openReservation() === 3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openReservation() === 3) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Un permis de conduire valide correspondant &agrave; la cat&eacute;gorie du v&eacute;hicule est requis. Pour les poids lourds, un permis C ou CE est n&eacute;cessaire.
            </div>
          }
        </div>
      </div>

      <!-- ============ SECTION : V&eacute;hicules ============ -->
      <div class="glass-card rounded-xl p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <svg class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H21M3.375 14.25h3.75L8.25 9h6l2.25 5.25h3.75m-16.875 0V6.375a1.125 1.125 0 0 1 1.125-1.125h5.25a1.125 1.125 0 0 1 1.125 1.125v7.875" />
          </svg>
          <h2 class="font-bold text-foreground uppercase text-sm tracking-wider">V&eacute;hicules</h2>
        </div>

        <!-- Q1 -->
        <div class="border-b border-border">
          <button (click)="toggle('vehicles', 0)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Quels types de camions proposez-vous&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openVehicles() === 0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openVehicles() === 0) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Nous disposons d&rsquo;une flotte vari&eacute;e&nbsp;: v&eacute;hicules utilitaires, camions bennes, camions plateaux, camions frigorifiques et poids lourds de diff&eacute;rentes capacit&eacute;s.
            </div>
          }
        </div>

        <!-- Q2 -->
        <div class="border-b border-border">
          <button (click)="toggle('vehicles', 1)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Les camions sont-ils r&eacute;cents&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openVehicles() === 1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openVehicles() === 1) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Notre flotte est r&eacute;guli&egrave;rement renouvel&eacute;e. La majorit&eacute; de nos v&eacute;hicules ont moins de 5 ans et sont entretenus selon les normes du constructeur.
            </div>
          }
        </div>

        <!-- Q3 -->
        <div class="border-b border-border last:border-b-0">
          <button (click)="toggle('vehicles', 2)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Le carburant est-il inclus&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openVehicles() === 2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openVehicles() === 2) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Non, le carburant n&rsquo;est pas inclus dans le prix de location. Le v&eacute;hicule est remis avec un niveau de carburant d&eacute;fini et doit &ecirc;tre restitu&eacute; au m&ecirc;me niveau.
            </div>
          }
        </div>
      </div>

      <!-- ============ SECTION : Options et services ============ -->
      <div class="glass-card rounded-xl p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <svg class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <h2 class="font-bold text-foreground uppercase text-sm tracking-wider">Options et services</h2>
        </div>

        <!-- Q1 -->
        <div class="border-b border-border">
          <button (click)="toggle('options', 0)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Proposez-vous des chauffeurs&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openOptions() === 0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openOptions() === 0) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Oui, nous proposons l&rsquo;option chauffeur professionnel pour tous nos v&eacute;hicules. Nos chauffeurs sont exp&eacute;riment&eacute;s et connaissent parfaitement le r&eacute;seau routier guin&eacute;en.
            </div>
          }
        </div>

        <!-- Q2 -->
        <div class="border-b border-border">
          <button (click)="toggle('options', 1)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>L&rsquo;assurance est-elle incluse&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openOptions() === 1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openOptions() === 1) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Une assurance de base est incluse dans toute location. Des options d&rsquo;assurance compl&eacute;mentaire (tous risques, bris de glace) sont disponibles.
            </div>
          }
        </div>

        <!-- Q3 -->
        <div class="border-b border-border last:border-b-0">
          <button (click)="toggle('options', 2)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Livrez-vous les camions sur site&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openOptions() === 2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openOptions() === 2) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Oui, nous proposons la livraison et la r&eacute;cup&eacute;ration de v&eacute;hicules sur votre site &agrave; Conakry et dans les principales villes de Guin&eacute;e.
            </div>
          }
        </div>
      </div>

      <!-- ============ SECTION : Paiement et facturation ============ -->
      <div class="glass-card rounded-xl p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <svg class="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25h-15a2.25 2.25 0 0 0-2.25 2.25v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <h2 class="font-bold text-foreground uppercase text-sm tracking-wider">Paiement et facturation</h2>
        </div>

        <!-- Q1 -->
        <div class="border-b border-border">
          <button (click)="toggle('payment', 0)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Quels modes de paiement acceptez-vous&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openPayment() === 0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openPayment() === 0) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Nous acceptons les paiements par virement bancaire, mobile money (Orange Money, MTN Money) et esp&egrave;ces &agrave; notre agence.
            </div>
          }
        </div>

        <!-- Q2 -->
        <div class="border-b border-border">
          <button (click)="toggle('payment', 1)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Faut-il verser une caution&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openPayment() === 1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openPayment() === 1) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Oui, une caution est demand&eacute;e au d&eacute;but de la location. Son montant varie selon le type de v&eacute;hicule. Elle est restitu&eacute;e int&eacute;gralement &agrave; la restitution du v&eacute;hicule en bon &eacute;tat.
            </div>
          }
        </div>

        <!-- Q3 -->
        <div class="border-b border-border last:border-b-0">
          <button (click)="toggle('payment', 2)" class="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-primary transition-colors">
            <span>Puis-je obtenir une facture&nbsp;?</span>
            <svg class="w-4 h-4 shrink-0 transition-transform duration-200" [class.rotate-180]="openPayment() === 2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          @if (openPayment() === 2) {
            <div class="pb-4 text-sm text-muted-foreground leading-relaxed">
              Oui, une facture d&eacute;taill&eacute;e est automatiquement g&eacute;n&eacute;r&eacute;e pour chaque location. Vous pouvez la t&eacute;l&eacute;charger depuis votre espace client.
            </div>
          }
        </div>
      </div>

      <!-- ============ CTA Section ============ -->
      <div class="glass-card rounded-xl p-8 text-center mt-12">
        <h2 class="text-xl font-heading font-bold text-foreground mb-2">
          Vous n&rsquo;avez pas trouv&eacute; votre r&eacute;ponse&nbsp;?
        </h2>
        <p class="text-sm text-muted-foreground mb-6">
          Notre &eacute;quipe est disponible pour r&eacute;pondre &agrave; toutes vos questions.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a routerLink="/contact"
            class="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Nous contacter
          </a>
          <a href="tel:+224492083800"
            class="inline-flex items-center gap-2 px-6 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            Appeler directement
          </a>
        </div>
      </div>

    </div>
  `,
})
export class FaqComponent {
  openReservation = signal(-1);
  openVehicles = signal(-1);
  openOptions = signal(-1);
  openPayment = signal(-1);

  toggle(section: 'reservation' | 'vehicles' | 'options' | 'payment', index: number): void {
    const sig = this.getSignal(section);
    sig.set(sig() === index ? -1 : index);
  }

  private getSignal(section: string) {
    switch (section) {
      case 'reservation': return this.openReservation;
      case 'vehicles': return this.openVehicles;
      case 'options': return this.openOptions;
      case 'payment': return this.openPayment;
      default: return this.openReservation;
    }
  }
}
