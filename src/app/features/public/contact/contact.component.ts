import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <!-- Header -->
      <div class="text-center mb-12">
        <span class="badge-label">Contactez-nous</span>
        <h1 class="section-title mt-4">PARLONS DE <span class="text-primary">VOTRE PROJET</span></h1>
        <p class="text-muted-foreground mt-3 max-w-xl mx-auto">Une question ? Un besoin particulier ? Notre &eacute;quipe est &agrave; votre disposition pour vous accompagner.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Left: Contact Info -->
        <div class="space-y-6">
          <!-- Phone -->
          <div class="glass-card rounded-xl p-6 flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-foreground mb-1">T&eacute;l&eacute;phone</h3>
              <p class="text-sm text-muted-foreground">+224 492 08 38 00</p>
              <p class="text-xs text-muted-foreground mt-1">Lun - Sam : 8h00 - 18h00</p>
            </div>
          </div>

          <!-- Email -->
          <div class="glass-card rounded-xl p-6 flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-foreground mb-1">E-mail</h3>
              <p class="text-sm text-muted-foreground">support&#64;truckrental.com</p>
              <p class="text-xs text-muted-foreground mt-1">R&eacute;ponse sous 24h</p>
            </div>
          </div>

          <!-- Address -->
          <div class="glass-card rounded-xl p-6 flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-foreground mb-1">Adresse</h3>
              <p class="text-sm text-muted-foreground">Conakry, Guin&eacute;e</p>
              <p class="text-xs text-muted-foreground mt-1">Quartier Kaloum</p>
            </div>
          </div>

          <!-- Horaires -->
          <div class="glass-card rounded-xl p-6 flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-foreground mb-1">Horaires</h3>
              <p class="text-sm text-muted-foreground">Lun - Sam : 8h00 - 18h00</p>
              <p class="text-xs text-muted-foreground mt-1">Dimanche : Ferm&eacute;</p>
            </div>
          </div>

          <!-- Urgence -->
          <div class="glass-card rounded-xl p-6 border-primary/30 bg-primary/5">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <h3 class="font-bold text-primary">Urgence technique</h3>
            </div>
            <p class="text-sm text-muted-foreground mb-3">Un probl&egrave;me avec un v&eacute;hicule en mission ? Notre &eacute;quipe d'assistance est disponible 24h/24.</p>
            <a href="tel:+224492083800" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Appeler maintenant
            </a>
          </div>
        </div>

        <!-- Right: Form -->
        <div>
          @if (sent()) {
            <div class="glass-card rounded-xl p-10 text-center">
              <div class="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-foreground mb-2">Message envoy&eacute; !</h3>
              <p class="text-sm text-muted-foreground mb-6">Merci pour votre message. Notre &eacute;quipe vous r&eacute;pondra dans les meilleurs d&eacute;lais.</p>
              <button (click)="reset()" class="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Envoyer un autre message
              </button>
            </div>
          } @else {
            <div class="glass-card rounded-xl p-8">
              <h2 class="text-lg font-bold text-foreground uppercase tracking-wide mb-6">Envoyer un message</h2>

              <form (ngSubmit)="submit()" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Nom complet *</label>
                    <input type="text" [(ngModel)]="name" name="name" required
                      class="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      placeholder="Votre nom" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">E-mail *</label>
                    <input type="email" [(ngModel)]="email" name="email" required
                      class="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      placeholder="votre&#64;email.com" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Entreprise</label>
                    <input type="text" [(ngModel)]="company" name="company"
                      class="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      placeholder="Nom de votre entreprise" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1.5">Sujet *</label>
                    <input type="text" [(ngModel)]="subject" name="subject" required
                      class="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                      placeholder="Objet de votre message" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                  <textarea [(ngModel)]="message" name="message" required rows="5"
                    class="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none"
                    placeholder="D&eacute;crivez votre demande..."></textarea>
                </div>

                @if (error()) {
                  <div class="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    {{ error() }}
                  </div>
                }

                <button type="submit" [disabled]="submitting()"
                  class="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 glow-amber">
                  @if (submitting()) {
                    Envoi en cours...
                  } @else {
                    <span class="flex items-center justify-center gap-2">
                      Envoyer le message
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </span>
                  }
                </button>
              </form>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent {
  private contactService = inject(ContactService);

  name = '';
  email = '';
  company = '';
  subject = '';
  message = '';

  submitting = signal(false);
  error = signal('');
  sent = signal(false);

  submit(): void {
    this.error.set('');
    this.submitting.set(true);

    this.contactService.send({
      name: this.name,
      email: this.email,
      phone: undefined,
      subject: this.subject,
      message: this.message,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.sent.set(true);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.message || 'Échec de l\'envoi du message. Veuillez réessayer.');
      },
    });
  }

  reset(): void {
    this.name = '';
    this.email = '';
    this.company = '';
    this.subject = '';
    this.message = '';
    this.sent.set(false);
  }
}
