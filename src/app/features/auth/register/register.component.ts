import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
      <div class="w-full max-w-md animate-fade-in">
        <div class="flex flex-col items-center mb-8">
          <div class="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 glow-amber">
            <span class="text-3xl">🚛</span>
          </div>
          <h1 class="text-3xl font-heading font-bold text-gradient uppercase tracking-widest">TRUCK RENTAL</h1>
          <p class="text-muted-foreground text-sm mt-1">Redirecting to registration...</p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.navigateToDashboard();
    } else {
      this.authService.register();
    }
  }
}
