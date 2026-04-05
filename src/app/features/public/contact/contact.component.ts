import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-heading font-bold text-foreground">Contactez-nous</h1>
        <p class="text-muted-foreground mt-2">Une question ? Un besoin particulier ? Écrivez-nous et nous vous répondrons rapidement.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Contact Info -->
        <div class="space-y-6">
          <div class="glass-card rounded-xl p-5">
            <div class="text-2xl mb-2">&#128231;</div>
            <h3 class="font-bold text-foreground text-sm">E-mail</h3>
            <p class="text-sm text-muted-foreground">support&#64;truckrental.com</p>
          </div>
          <div class="glass-card rounded-xl p-5">
            <div class="text-2xl mb-2">&#128222;</div>
            <h3 class="font-bold text-foreground text-sm">Téléphone</h3>
            <p class="text-sm text-muted-foreground">+224 492 08 38 00</p>
          </div>
          <div class="glass-card rounded-xl p-5">
            <div class="text-2xl mb-2">&#128205;</div>
            <h3 class="font-bold text-foreground text-sm">Adresse</h3>
            <p class="text-sm text-muted-foreground">Conakry, Guinée</p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="md:col-span-2">
          @if (sent()) {
            <div class="glass-card rounded-xl p-10 text-center">
              <div class="text-5xl mb-4">&#9989;</div>
              <h3 class="text-xl font-bold text-foreground mb-2">Message envoyé !</h3>
              <p class="text-sm text-muted-foreground mb-6">Merci pour votre message. Notre équipe vous répondra dans les meilleurs délais.</p>
              <button (click)="reset()" class="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Envoyer un autre message
              </button>
            </div>
          } @else {
            <form (ngSubmit)="submit()" class="glass-card rounded-xl p-6 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">Nom complet *</label>
                  <input type="text" [(ngModel)]="name" name="name" required
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Votre nom" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">E-mail *</label>
                  <input type="email" [(ngModel)]="email" name="email" required
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="votre@email.com" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">Téléphone</label>
                  <input type="tel" [(ngModel)]="phone" name="phone"
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="+224 ..." />
                </div>
                <div>
                  <label class="block text-sm font-medium text-foreground mb-1">Sujet *</label>
                  <input type="text" [(ngModel)]="subject" name="subject" required
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Objet de votre message" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Message *</label>
                <textarea [(ngModel)]="message" name="message" required rows="5"
                  class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Décrivez votre demande..."></textarea>
              </div>

              @if (error()) {
                <div class="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {{ error() }}
                </div>
              }

              <button type="submit" [disabled]="submitting()"
                class="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                {{ submitting() ? 'Envoi en cours...' : 'Envoyer le message' }}
              </button>
            </form>
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
  phone = '';
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
      phone: this.phone || undefined,
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
    this.phone = '';
    this.subject = '';
    this.message = '';
    this.sent.set(false);
  }
}
