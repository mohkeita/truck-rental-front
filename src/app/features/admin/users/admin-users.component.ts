import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { AuthService } from '../../../core/services/auth.service';
import { AdminUser, UserRole } from '../../../core/models/admin-user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="animate-fade-in">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-heading font-bold text-gradient uppercase">Utilisateurs</h1>
          <p class="text-muted-foreground text-sm mt-1">Gérer les comptes et modifier les rôles</p>
        </div>
        <div class="flex items-center gap-3">
          <input type="text" placeholder="Rechercher..."
            [value]="search()" (input)="search.set($any($event.target).value)"
            class="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <button (click)="reload()"
            class="px-3 py-2 bg-secondary text-foreground rounded-lg text-sm hover:bg-muted transition-colors">
            Actualiser
          </button>
        </div>
      </div>

      @if (notification(); as notif) {
        <div [class]="'mb-4 p-3 rounded-lg text-sm ' + (notif.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20')">
          {{ notif.message }}
        </div>
      }

      <div class="glass-card rounded-xl overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border">
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Username</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Nom complet</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Email</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Rôle</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Statut</th>
              <th class="text-left p-4 text-sm text-muted-foreground font-medium">Créé le</th>
              <th class="text-right p-4 text-sm text-muted-foreground font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            @if (loading()) {
              <tr><td colspan="7" class="p-8 text-center text-muted-foreground text-sm">Chargement…</td></tr>
            } @else {
              @for (user of filteredUsers(); track user.id) {
                <tr class="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td class="p-4 text-foreground font-medium text-sm">
                    {{ user.username }}
                    @if (isCurrentUser(user)) {
                      <span class="ml-2 text-xs text-primary">(vous)</span>
                    }
                  </td>
                  <td class="p-4 text-foreground text-sm">
                    @if (user.firstName || user.lastName) {
                      {{ user.firstName ?? '' }} {{ user.lastName ?? '' }}
                    } @else {
                      <span class="text-muted-foreground">—</span>
                    }
                  </td>
                  <td class="p-4 text-muted-foreground text-sm">{{ user.email ?? '—' }}</td>
                  <td class="p-4">
                    <span [class]="roleBadgeClass(user.role)">{{ user.role }}</span>
                  </td>
                  <td class="p-4">
                    @if (user.enabled) {
                      <span class="px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">Actif</span>
                    } @else {
                      <span class="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">Désactivé</span>
                    }
                  </td>
                  <td class="p-4 text-muted-foreground text-sm">
                    {{ user.createdTimestamp ? (user.createdTimestamp | date:'dd/MM/yyyy') : '—' }}
                  </td>
                  <td class="p-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <select
                        [value]="user.role"
                        [disabled]="isCurrentUser(user) || changingId() === user.id || !user.enabled"
                        (change)="onRoleChange(user, $any($event.target).value)"
                        class="px-2 py-1.5 bg-background border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="ADMIN">ADMIN</option>
                        <option value="OWNER">OWNER</option>
                        <option value="CLIENT">CLIENT</option>
                      </select>
                      @if (user.enabled) {
                        <button
                          (click)="onToggleEnabled(user)"
                          [disabled]="isCurrentUser(user) || togglingId() === user.id"
                          class="px-2 py-1.5 rounded-md text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          Bannir
                        </button>
                      } @else {
                        <button
                          (click)="onToggleEnabled(user)"
                          [disabled]="togglingId() === user.id"
                          class="px-2 py-1.5 rounded-md text-xs font-medium bg-success/10 text-success border border-success/20 hover:bg-success/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          Réactiver
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="7" class="p-8 text-center text-muted-foreground text-sm">Aucun utilisateur trouvé</td></tr>
              }
            }
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-xs text-muted-foreground">
        Note : après un changement de rôle, l'utilisateur concerné doit se déconnecter et se reconnecter pour que son nouveau rôle prenne effet dans son token.
      </p>
    </div>
  `,
})
export class AdminUsersComponent implements OnInit {
  private adminUserService = inject(AdminUserService);
  private authService = inject(AuthService);

  users = signal<AdminUser[]>([]);
  loading = signal(false);
  changingId = signal<string | null>(null);
  togglingId = signal<string | null>(null);
  search = signal('');
  notification = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  filteredUsers = computed(() => {
    const q = this.search().toLowerCase().trim();
    const list = this.users();
    if (!q) return list;
    return list.filter(u =>
      u.username.toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q) ||
      (u.firstName ?? '').toLowerCase().includes(q) ||
      (u.lastName ?? '').toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  ngOnInit() { this.reload(); }

  reload() {
    this.loading.set(true);
    this.notification.set(null);
    this.adminUserService.list().subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.showError('Impossible de charger les utilisateurs : ' + (err?.error?.message ?? err?.message ?? 'erreur inconnue'));
      },
    });
  }

  isCurrentUser(user: AdminUser): boolean {
    return user.username === this.authService.currentUser()?.username;
  }

  onRoleChange(user: AdminUser, newRole: string) {
    if (newRole === user.role) return;
    const role = newRole as UserRole;
    const label = `${user.username} → ${role}`;
    if (!confirm(`Changer le rôle de ${label} ?\n\nL'utilisateur devra se reconnecter pour que le changement prenne effet.`)) {
      // Revert visual — signal-based, re-set users to trigger re-render
      this.users.set([...this.users()]);
      return;
    }

    this.changingId.set(user.id);
    this.adminUserService.changeRole(user.id, role).subscribe({
      next: () => {
        this.users.update(list => list.map(u => u.id === user.id ? { ...u, role } : u));
        this.changingId.set(null);
        this.showSuccess(`Rôle de ${user.username} changé en ${role}.`);
      },
      error: err => {
        this.changingId.set(null);
        this.users.set([...this.users()]);
        this.showError('Échec du changement de rôle : ' + (err?.error?.message ?? err?.message ?? 'erreur inconnue'));
      },
    });
  }

  onToggleEnabled(user: AdminUser) {
    const next = !user.enabled;
    const action = next ? 'réactiver' : 'bannir';
    if (!confirm(`Voulez-vous ${action} ${user.username} ?${!next ? '\n\nSes sessions actives seront fermées immédiatement.' : ''}`)) {
      return;
    }

    this.togglingId.set(user.id);
    this.adminUserService.setEnabled(user.id, next).subscribe({
      next: () => {
        this.users.update(list => list.map(u => u.id === user.id ? { ...u, enabled: next } : u));
        this.togglingId.set(null);
        this.showSuccess(next ? `${user.username} a été réactivé.` : `${user.username} a été banni.`);
      },
      error: err => {
        this.togglingId.set(null);
        this.showError('Échec de l\'opération : ' + (err?.error?.message ?? err?.message ?? 'erreur inconnue'));
      },
    });
  }

  roleBadgeClass(role: string): string {
    const base = 'px-2 py-0.5 rounded text-xs font-medium ';
    switch (role) {
      case 'ADMIN': return base + 'bg-primary/10 text-primary border border-primary/20';
      case 'OWNER': return base + 'bg-warning/10 text-warning border border-warning/20';
      case 'CLIENT': return base + 'bg-secondary text-secondary-foreground';
      default: return base + 'bg-muted text-muted-foreground';
    }
  }

  private showSuccess(message: string) {
    this.notification.set({ type: 'success', message });
    setTimeout(() => this.notification.set(null), 5000);
  }

  private showError(message: string) {
    this.notification.set({ type: 'error', message });
    setTimeout(() => this.notification.set(null), 8000);
  }
}
