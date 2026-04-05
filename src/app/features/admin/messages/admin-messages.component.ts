import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ContactService } from '../../../core/services/contact.service';
import { ContactMessageResponse } from '../../../core/models/contact.model';

@Component({
  selector: 'app-admin-messages',
  imports: [DatePipe],
  template: `
    <div class="animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-heading font-bold text-foreground">Messages de contact</h1>
          <p class="text-sm text-muted-foreground mt-1">{{ unreadCount() }} non lu(s)</p>
        </div>
      </div>

      @if (selectedMessage()) {
        <!-- Detail view -->
        <div class="glass-card rounded-xl p-6 animate-fade-in">
          <button (click)="closeDetail()" class="text-sm text-primary hover:underline mb-4 inline-block">&larr; Retour à la liste</button>

          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-foreground">{{ selectedMessage()!.subject }}</h2>
              <p class="text-sm text-muted-foreground mt-1">
                De <span class="text-foreground font-medium">{{ selectedMessage()!.name }}</span>
                &lt;{{ selectedMessage()!.email }}&gt;
                @if (selectedMessage()!.phone) {
                  &middot; {{ selectedMessage()!.phone }}
                }
              </p>
              <p class="text-xs text-muted-foreground mt-1">{{ selectedMessage()!.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
            <div class="flex gap-2">
              @if (!selectedMessage()!.read) {
                <button (click)="markAsRead(selectedMessage()!.id)"
                  class="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                  Marquer comme lu
                </button>
              }
              <button (click)="confirmDelete(selectedMessage()!.id)"
                class="px-3 py-1.5 text-xs font-medium bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors">
                Supprimer
              </button>
            </div>
          </div>

          <div class="bg-background rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap border border-border">{{ selectedMessage()!.message }}</div>
        </div>
      } @else {
        <!-- List view -->
        @if (messages().length === 0 && !loading()) {
          <div class="glass-card rounded-xl p-12 text-center">
            <div class="text-4xl mb-3">&#128236;</div>
            <p class="text-lg font-medium text-foreground">Aucun message</p>
            <p class="text-sm text-muted-foreground mt-1">Les messages de contact apparaîtront ici</p>
          </div>
        } @else {
          <div class="space-y-2">
            @for (msg of messages(); track msg.id) {
              <button (click)="viewMessage(msg)"
                class="w-full text-left glass-card rounded-xl p-4 hover:border-primary/50 transition-all"
                [class.border-l-4]="!msg.read"
                [class.border-l-primary]="!msg.read">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      @if (!msg.read) {
                        <span class="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                      }
                      <span class="font-medium text-sm text-foreground truncate" [class.font-bold]="!msg.read">{{ msg.name }}</span>
                      <span class="text-xs text-muted-foreground">&lt;{{ msg.email }}&gt;</span>
                    </div>
                    <p class="text-sm text-foreground mt-1 truncate" [class.font-semibold]="!msg.read">{{ msg.subject }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5 truncate">{{ msg.message }}</p>
                  </div>
                  <span class="text-xs text-muted-foreground whitespace-nowrap ml-4">{{ msg.createdAt | date:'dd/MM HH:mm' }}</span>
                </div>
              </button>
            }
          </div>

          @if (totalPages() > 1) {
            <div class="mt-6 flex items-center justify-center gap-2">
              <button (click)="changePage(currentPage() - 1)" [disabled]="currentPage() === 0"
                class="px-4 py-2 glass-card rounded-lg text-sm disabled:opacity-40 hover:border-primary/50 text-foreground transition-all">
                Précédent
              </button>
              <span class="text-sm text-muted-foreground">Page {{ currentPage() + 1 }} / {{ totalPages() }}</span>
              <button (click)="changePage(currentPage() + 1)" [disabled]="currentPage() >= totalPages() - 1"
                class="px-4 py-2 glass-card rounded-lg text-sm disabled:opacity-40 hover:border-primary/50 text-foreground transition-all">
                Suivant
              </button>
            </div>
          }
        }
      }
    </div>
  `,
})
export class AdminMessagesComponent implements OnInit {
  private contactService = inject(ContactService);

  messages = signal<ContactMessageResponse[]>([]);
  selectedMessage = signal<ContactMessageResponse | null>(null);
  currentPage = signal(0);
  totalPages = signal(0);
  loading = signal(false);

  unreadCount = signal(0);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.contactService.getAll(this.currentPage(), 15).subscribe({
      next: (page) => {
        this.messages.set(page.content);
        this.totalPages.set(page.totalPages);
        this.unreadCount.set(page.content.filter(m => !m.read).length);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  viewMessage(msg: ContactMessageResponse): void {
    this.selectedMessage.set(msg);
    if (!msg.read) {
      this.markAsRead(msg.id);
    }
  }

  markAsRead(id: number): void {
    this.contactService.markAsRead(id).subscribe({
      next: (updated) => {
        this.messages.update(msgs => msgs.map(m => m.id === id ? updated : m));
        if (this.selectedMessage()?.id === id) {
          this.selectedMessage.set(updated);
        }
        this.unreadCount.set(this.messages().filter(m => !m.read).length);
      },
    });
  }

  confirmDelete(id: number): void {
    if (!confirm('Supprimer ce message ?')) return;
    this.contactService.delete(id).subscribe({
      next: () => {
        this.selectedMessage.set(null);
        this.load();
      },
    });
  }

  closeDetail(): void {
    this.selectedMessage.set(null);
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.load();
  }
}
