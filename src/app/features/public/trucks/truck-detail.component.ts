import { Component, inject, signal, computed, OnInit, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { TruckService } from '../../../core/services/truck.service';
import { TruckResponse } from '../../../core/models/truck.model';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { PaymentService } from '../../../core/services/payment.service';
import { LocationService } from '../../../core/services/location.service';
import { LocationResponse } from '../../../core/models/location.model';
import { ExtraRequest } from '../../../core/models/booking.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-truck-detail',
  imports: [RouterLink, DecimalPipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <a routerLink="/" class="hover:text-foreground transition-colors">Accueil</a>
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        <a routerLink="/trucks" class="hover:text-foreground transition-colors">Catalogue</a>
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        @if (truck(); as t) {
          <span class="text-foreground">{{ t.brand }} {{ t.model }}</span>
        }
      </nav>

      @if (truck(); as t) {
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Left: Main content (70%) -->
          <div class="lg:w-[70%]">
            <!-- Photo Gallery -->
            <div class="glass-card rounded-xl overflow-hidden mb-6">
              <div class="relative h-72 sm:h-96 w-full group">
                @if (t.photoUrls?.length) {
                  <img [src]="apiUrl + t.photoUrls![currentPhoto()]" [alt]="t.brand + ' ' + t.model"
                    class="h-full w-full object-cover transition-opacity duration-300" />

                  @if (t.photoUrls!.length > 1) {
                    <span class="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {{ currentPhoto() + 1 }} / {{ t.photoUrls!.length }}
                    </span>
                    <button (click)="prevPhoto()" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all cursor-pointer">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <button (click)="nextPhoto()" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-all cursor-pointer">
                      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  }
                } @else {
                  <div class="h-full w-full bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
                    <svg class="w-24 h-24 text-muted-foreground/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M1 12.5V16a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0h4m12 0a2 2 0 104 0m-4 0h4a1 1 0 001-1v-5.07a1 1 0 00-.293-.707l-3-3A1 1 0 0017.586 7H15V5a1 1 0 00-1-1H3a1 1 0 00-1 1v7.5"/>
                      <path d="M15 7v4h5"/>
                    </svg>
                  </div>
                }
              </div>

              <!-- Thumbnails -->
              @if (t.photoUrls && t.photoUrls.length > 1) {
                <div class="flex gap-2 p-3 overflow-x-auto">
                  @for (url of t.photoUrls; track url; let i = $index) {
                    <button (click)="goToPhoto(i)"
                      class="h-16 w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors cursor-pointer"
                      [class]="i === currentPhoto() ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'">
                      <img [src]="apiUrl + url" [alt]="'Photo ' + (i + 1)" class="h-full w-full object-cover" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Title & Price (mobile) -->
            <div class="lg:hidden mb-6">
              <h1 class="text-3xl font-heading font-bold text-foreground">{{ t.brand }} {{ t.model }}</h1>
              <p class="text-muted-foreground">{{ t.licensePlate }}</p>
              @if (t.pricePerDay) {
                <div class="text-3xl font-bold text-primary mt-2">{{ t.pricePerDay | number:'1.0-0' }} GNF<span class="text-sm font-normal text-muted-foreground">/jour</span></div>
              }
            </div>

            <!-- Title (desktop) -->
            <div class="hidden lg:block mb-6">
              <h1 class="text-3xl font-heading font-bold text-foreground">{{ t.brand }} {{ t.model }}</h1>
              <p class="text-muted-foreground mt-1">{{ t.licensePlate }}</p>
            </div>

            @if (t.description) {
              <p class="text-muted-foreground mb-8 leading-relaxed">{{ t.description }}</p>
            }

            <!-- Specs Grid -->
            <h2 class="text-lg font-bold text-foreground uppercase tracking-wide mb-4">Sp&eacute;cifications</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div class="glass-card rounded-xl p-4 text-center">
                <svg class="w-6 h-6 text-primary mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
                <div class="text-xs text-muted-foreground">Capacit&eacute;</div>
                <div class="font-bold text-foreground">{{ t.capacityTons }} tonnes</div>
              </div>
              <div class="glass-card rounded-xl p-4 text-center">
                <svg class="w-6 h-6 text-primary mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <div class="text-xs text-muted-foreground">Ann&eacute;e</div>
                <div class="font-bold text-foreground">{{ t.year }}</div>
              </div>
              @if (t.transmission) {
                <div class="glass-card rounded-xl p-4 text-center">
                  <svg class="w-6 h-6 text-primary mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                  <div class="text-xs text-muted-foreground">Transmission</div>
                  <div class="font-bold text-foreground">{{ t.transmission }}</div>
                </div>
              }
              @if (t.fuel) {
                <div class="glass-card rounded-xl p-4 text-center">
                  <svg class="w-6 h-6 text-primary mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22V6l7-4 7 4v16"/><path d="M10 2v4"/><path d="M17 6l4 2v8l-4 2"/></svg>
                  <div class="text-xs text-muted-foreground">Carburant</div>
                  <div class="font-bold text-foreground">{{ t.fuel }}</div>
                </div>
              }
              @if (t.seats) {
                <div class="glass-card rounded-xl p-4 text-center">
                  <svg class="w-6 h-6 text-primary mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <div class="text-xs text-muted-foreground">Places</div>
                  <div class="font-bold text-foreground">{{ t.seats }}</div>
                </div>
              }
              @if (t.horsepower) {
                <div class="glass-card rounded-xl p-4 text-center">
                  <svg class="w-6 h-6 text-primary mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <div class="text-xs text-muted-foreground">Puissance</div>
                  <div class="font-bold text-foreground">{{ t.horsepower }} ch</div>
                </div>
              }
            </div>

            <!-- Tarifs -->
            @if (t.pricePerDay) {
              <h2 class="text-lg font-bold text-foreground uppercase tracking-wide mb-4">Tarifs</h2>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div class="glass-card rounded-xl p-5 text-center">
                  <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Journalier</div>
                  <div class="text-2xl font-bold text-primary font-heading">{{ t.pricePerDay | number:'1.0-0' }}</div>
                  <div class="text-xs text-muted-foreground">GNF / jour</div>
                </div>
                <div class="glass-card rounded-xl p-5 text-center border-primary/30">
                  <div class="text-xs text-primary uppercase tracking-wider mb-1 font-semibold">Hebdomadaire</div>
                  <div class="text-2xl font-bold text-primary font-heading">{{ weeklyPrice() | number:'1.0-0' }}</div>
                  <div class="text-xs text-muted-foreground">GNF / semaine</div>
                </div>
                <div class="glass-card rounded-xl p-5 text-center">
                  <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">Mensuel</div>
                  <div class="text-2xl font-bold text-primary font-heading">{{ monthlyPrice() | number:'1.0-0' }}</div>
                  <div class="text-xs text-muted-foreground">GNF / mois</div>
                </div>
              </div>
            }

            <!-- Equipment -->
            <h2 class="text-lg font-bold text-foreground uppercase tracking-wide mb-4">&Eacute;quipements</h2>
            <div class="flex flex-wrap gap-3 mb-8">
              @if (t.gps) {
                <span class="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-medium">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  GPS
                </span>
              }
              @if (t.bluetooth) {
                <span class="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-medium">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Bluetooth
                </span>
              }
              @if (t.airConditioning) {
                <span class="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-medium">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Climatisation
                </span>
              }
              @if (t.cruiseControl) {
                <span class="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-medium">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  R&eacute;gulateur de vitesse
                </span>
              }
              @if (t.parkingSensors) {
                <span class="flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-medium">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Capteurs de stationnement
                </span>
              }
              @if (!t.gps && !t.bluetooth && !t.airConditioning && !t.cruiseControl && !t.parkingSensors) {
                <span class="text-sm text-muted-foreground">Aucun &eacute;quipement suppl&eacute;mentaire</span>
              }
            </div>

            <!-- Mobile Booking -->
            <div class="lg:hidden glass-card rounded-xl p-6 mt-6">
              <h3 class="text-lg font-bold text-foreground mb-4">R&eacute;server ce camion</h3>
              @if (t.pricePerDay) {
                <div class="text-xl font-bold text-primary mb-4">{{ t.pricePerDay | number:'1.0-0' }} GNF<span class="text-sm font-normal text-muted-foreground">/jour</span></div>
              }
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">D&eacute;but</label>
                  <input type="date" [value]="startDate()" [min]="minDate()" (input)="startDate.set($any($event.target).value)"
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Fin</label>
                  <input type="date" [value]="endDate()" [min]="startDate() || minDate()" (input)="endDate.set($any($event.target).value)"
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <!-- P&eacute;riodes r&eacute;serv&eacute;es (mobile) -->
              @if (unavailablePeriods().length > 0) {
                <div class="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div class="text-xs font-bold text-destructive mb-1.5">P&eacute;riodes r&eacute;serv&eacute;es :</div>
                  @for (p of unavailablePeriods(); track p.startDate) {
                    <div class="text-xs text-destructive/80">{{ formatDate(p.startDate) }} &rarr; {{ formatDate(p.endDate) }}</div>
                  }
                </div>
              }
              @if (dateConflict()) {
                <div class="mb-4 p-3 bg-destructive/15 border border-destructive/30 rounded-lg text-xs font-medium text-destructive">
                  {{ dateConflict() }}
                </div>
              }
              @if (rentalDays() > 0) {
                <div class="text-xs text-muted-foreground mb-4">{{ rentalDays() }} jour{{ rentalDays() > 1 ? 's' : '' }} de location</div>
              }
              <!-- Lieux -->
              @if (locations().length > 0) {
                <div class="grid grid-cols-1 gap-3 mb-4">
                  <div>
                    <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Lieu de retrait</label>
                    <select [value]="selectedPickupLocationId()" (change)="selectedPickupLocationId.set(+$any($event.target).value)"
                      class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      @for (loc of locations(); track loc.id) {
                        <option [value]="loc.id">{{ loc.name }} — {{ loc.city }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Lieu de retour</label>
                    <select [value]="selectedReturnLocationId()" (change)="selectedReturnLocationId.set(+$any($event.target).value)"
                      class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      @for (loc of locations(); track loc.id) {
                        <option [value]="loc.id">{{ loc.name }} — {{ loc.city }}</option>
                      }
                    </select>
                  </div>
                </div>
              }
              <div class="space-y-3 mb-4">
                <button (click)="optChauffeur.set(!optChauffeur())" class="w-full flex items-center justify-between py-2 cursor-pointer">
                  <div>
                    <span class="text-sm text-foreground">Chauffeur professionnel</span>
                    <span class="text-xs text-muted-foreground ml-1">+150 000 GNF/j</span>
                  </div>
                  <div class="w-10 h-5 rounded-full relative transition-colors" [class]="optChauffeur() ? 'bg-primary' : 'bg-secondary'">
                    <div class="w-4 h-4 rounded-full absolute top-0.5 transition-all" [class]="optChauffeur() ? 'bg-primary-foreground left-5' : 'bg-muted-foreground left-0.5'"></div>
                  </div>
                </button>
                <button (click)="optAssurance.set(!optAssurance())" class="w-full flex items-center justify-between py-2 cursor-pointer">
                  <div>
                    <span class="text-sm text-foreground">Assurance tous risques</span>
                    <span class="text-xs text-muted-foreground ml-1">+75 000 GNF/j</span>
                  </div>
                  <div class="w-10 h-5 rounded-full relative transition-colors" [class]="optAssurance() ? 'bg-primary' : 'bg-secondary'">
                    <div class="w-4 h-4 rounded-full absolute top-0.5 transition-all" [class]="optAssurance() ? 'bg-primary-foreground left-5' : 'bg-muted-foreground left-0.5'"></div>
                  </div>
                </button>
                <button (click)="optLivraison.set(!optLivraison())" class="w-full flex items-center justify-between py-2 cursor-pointer">
                  <div>
                    <span class="text-sm text-foreground">Livraison sur site</span>
                    <span class="text-xs text-muted-foreground ml-1">+200 000 GNF</span>
                  </div>
                  <div class="w-10 h-5 rounded-full relative transition-colors" [class]="optLivraison() ? 'bg-primary' : 'bg-secondary'">
                    <div class="w-4 h-4 rounded-full absolute top-0.5 transition-all" [class]="optLivraison() ? 'bg-primary-foreground left-5' : 'bg-muted-foreground left-0.5'"></div>
                  </div>
                </button>
              </div>
              @if (rentalDays() > 0 && t.pricePerDay) {
                <div class="border-t border-border pt-4 mb-4 space-y-2 text-sm">
                  <div class="flex justify-between text-muted-foreground">
                    <span>Location ({{ rentalDays() }}j &times; {{ t.pricePerDay | number:'1.0-0' }})</span>
                    <span>{{ baseTotal() | number:'1.0-0' }} GNF</span>
                  </div>
                  @if (optChauffeur()) {
                    <div class="flex justify-between text-muted-foreground">
                      <span>Chauffeur ({{ rentalDays() }}j)</span>
                      <span>+{{ chauffeurTotal() | number:'1.0-0' }} GNF</span>
                    </div>
                  }
                  @if (optAssurance()) {
                    <div class="flex justify-between text-muted-foreground">
                      <span>Assurance ({{ rentalDays() }}j)</span>
                      <span>+{{ assuranceTotal() | number:'1.0-0' }} GNF</span>
                    </div>
                  }
                  @if (optLivraison()) {
                    <div class="flex justify-between text-muted-foreground">
                      <span>Livraison</span>
                      <span>+200 000 GNF</span>
                    </div>
                  }
                  <div class="flex justify-between font-bold text-foreground pt-2 border-t border-border text-lg">
                    <span>Total</span>
                    <span class="text-primary">{{ grandTotal() | number:'1.0-0' }} GNF</span>
                  </div>
                </div>
              }
              <button (click)="rentTruck()" [disabled]="bookingInProgress() || !!dateConflict()"
                class="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors glow-amber disabled:opacity-50">
                @if (bookingInProgress()) {
                  Traitement en cours...
                } @else if (dateConflict()) {
                  Dates indisponibles
                } @else if (rentalDays() > 0 && t.pricePerDay) {
                  R&eacute;server &middot; {{ grandTotal() | number:'1.0-0' }} GNF
                } @else {
                  R&eacute;server ce camion
                }
              </button>
              @if (bookingError()) {
                <p class="text-xs text-destructive text-center mt-2">{{ bookingError() }}</p>
              }
              @if (!authService.isAuthenticated()) {
                <p class="text-xs text-muted-foreground text-center mt-2">Vous devez &ecirc;tre connect&eacute; pour r&eacute;server</p>
              }
            </div>
          </div>

          <!-- Right: Booking Sidebar (30%) -->
          <div class="hidden lg:block lg:w-[30%]">
            <div class="glass-card rounded-xl p-6 sticky top-24">
              <h3 class="text-lg font-bold text-foreground mb-1">R&eacute;server ce camion</h3>
              @if (t.pricePerDay) {
                <div class="text-2xl font-bold text-primary mb-5">{{ t.pricePerDay | number:'1.0-0' }} GNF<span class="text-sm font-normal text-muted-foreground">/jour</span></div>
              }

              <!-- Dates -->
              <div class="space-y-4 mb-5">
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Date de d&eacute;but</label>
                  <input type="date" [value]="startDate()" [min]="minDate()" (input)="startDate.set($any($event.target).value)"
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Date de fin</label>
                  <input type="date" [value]="endDate()" [min]="startDate() || minDate()" (input)="endDate.set($any($event.target).value)"
                    class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>

              <!-- P&eacute;riodes r&eacute;serv&eacute;es -->
              @if (unavailablePeriods().length > 0) {
                <div class="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div class="text-xs font-bold text-destructive mb-1.5">P&eacute;riodes r&eacute;serv&eacute;es :</div>
                  @for (p of unavailablePeriods(); track p.startDate) {
                    <div class="text-xs text-destructive/80">{{ formatDate(p.startDate) }} &rarr; {{ formatDate(p.endDate) }}</div>
                  }
                </div>
              }

              <!-- Conflit de dates -->
              @if (dateConflict()) {
                <div class="mb-4 p-3 bg-destructive/15 border border-destructive/30 rounded-lg text-xs font-medium text-destructive">
                  {{ dateConflict() }}
                </div>
              }

              @if (rentalDays() > 0) {
                <div class="text-xs text-muted-foreground mb-5 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {{ rentalDays() }} jour{{ rentalDays() > 1 ? 's' : '' }} de location
                </div>
              }

              <!-- Lieux -->
              @if (locations().length > 0) {
                <div class="space-y-4 mb-5">
                  <div>
                    <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Lieu de retrait</label>
                    <select [value]="selectedPickupLocationId()" (change)="selectedPickupLocationId.set(+$any($event.target).value)"
                      class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      @for (loc of locations(); track loc.id) {
                        <option [value]="loc.id">{{ loc.name }} — {{ loc.city }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-foreground uppercase tracking-wider mb-1.5">Lieu de retour</label>
                    <select [value]="selectedReturnLocationId()" (change)="selectedReturnLocationId.set(+$any($event.target).value)"
                      class="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                      @for (loc of locations(); track loc.id) {
                        <option [value]="loc.id">{{ loc.name }} — {{ loc.city }}</option>
                      }
                    </select>
                  </div>
                </div>
              }

              <!-- Options -->
              <div class="space-y-3 mb-5">
                <h4 class="text-xs font-bold text-foreground uppercase tracking-wider">Options</h4>
                <button (click)="optChauffeur.set(!optChauffeur())" class="w-full flex items-center justify-between py-2.5 cursor-pointer group">
                  <div class="text-left">
                    <div class="text-sm group-hover:text-foreground transition-colors" [class]="optChauffeur() ? 'text-foreground' : 'text-muted-foreground'">Chauffeur professionnel</div>
                    <div class="text-xs text-muted-foreground">+150 000 GNF/jour</div>
                  </div>
                  <div class="w-10 h-5 rounded-full relative transition-colors shrink-0 ml-3" [class]="optChauffeur() ? 'bg-primary' : 'bg-secondary'">
                    <div class="w-4 h-4 rounded-full absolute top-0.5 transition-all" [class]="optChauffeur() ? 'bg-primary-foreground left-5' : 'bg-muted-foreground left-0.5'"></div>
                  </div>
                </button>
                <button (click)="optAssurance.set(!optAssurance())" class="w-full flex items-center justify-between py-2.5 cursor-pointer group">
                  <div class="text-left">
                    <div class="text-sm group-hover:text-foreground transition-colors" [class]="optAssurance() ? 'text-foreground' : 'text-muted-foreground'">Assurance tous risques</div>
                    <div class="text-xs text-muted-foreground">+75 000 GNF/jour</div>
                  </div>
                  <div class="w-10 h-5 rounded-full relative transition-colors shrink-0 ml-3" [class]="optAssurance() ? 'bg-primary' : 'bg-secondary'">
                    <div class="w-4 h-4 rounded-full absolute top-0.5 transition-all" [class]="optAssurance() ? 'bg-primary-foreground left-5' : 'bg-muted-foreground left-0.5'"></div>
                  </div>
                </button>
                <button (click)="optMaintenance.set(!optMaintenance())" class="w-full flex items-center justify-between py-2.5 cursor-pointer group">
                  <div class="text-left">
                    <div class="text-sm group-hover:text-foreground transition-colors" [class]="optMaintenance() ? 'text-foreground' : 'text-muted-foreground'">Maintenance incluse</div>
                    <div class="text-xs text-muted-foreground">+50 000 GNF/jour</div>
                  </div>
                  <div class="w-10 h-5 rounded-full relative transition-colors shrink-0 ml-3" [class]="optMaintenance() ? 'bg-primary' : 'bg-secondary'">
                    <div class="w-4 h-4 rounded-full absolute top-0.5 transition-all" [class]="optMaintenance() ? 'bg-primary-foreground left-5' : 'bg-muted-foreground left-0.5'"></div>
                  </div>
                </button>
                <button (click)="optLivraison.set(!optLivraison())" class="w-full flex items-center justify-between py-2.5 cursor-pointer group">
                  <div class="text-left">
                    <div class="text-sm group-hover:text-foreground transition-colors" [class]="optLivraison() ? 'text-foreground' : 'text-muted-foreground'">Livraison sur site</div>
                    <div class="text-xs text-muted-foreground">+200 000 GNF (forfait)</div>
                  </div>
                  <div class="w-10 h-5 rounded-full relative transition-colors shrink-0 ml-3" [class]="optLivraison() ? 'bg-primary' : 'bg-secondary'">
                    <div class="w-4 h-4 rounded-full absolute top-0.5 transition-all" [class]="optLivraison() ? 'bg-primary-foreground left-5' : 'bg-muted-foreground left-0.5'"></div>
                  </div>
                </button>
              </div>

              <!-- Price Breakdown -->
              @if (rentalDays() > 0 && t.pricePerDay) {
                <div class="border-t border-border pt-4 mb-5 space-y-2.5 text-sm">
                  <div class="flex justify-between text-muted-foreground">
                    <span>Location ({{ rentalDays() }}j &times; {{ t.pricePerDay | number:'1.0-0' }})</span>
                    <span>{{ baseTotal() | number:'1.0-0' }} GNF</span>
                  </div>
                  @if (optChauffeur()) {
                    <div class="flex justify-between text-muted-foreground">
                      <span>Chauffeur ({{ rentalDays() }}j &times; 150 000)</span>
                      <span>+{{ chauffeurTotal() | number:'1.0-0' }} GNF</span>
                    </div>
                  }
                  @if (optAssurance()) {
                    <div class="flex justify-between text-muted-foreground">
                      <span>Assurance ({{ rentalDays() }}j &times; 75 000)</span>
                      <span>+{{ assuranceTotal() | number:'1.0-0' }} GNF</span>
                    </div>
                  }
                  @if (optMaintenance()) {
                    <div class="flex justify-between text-muted-foreground">
                      <span>Maintenance ({{ rentalDays() }}j &times; 50 000)</span>
                      <span>+{{ maintenanceTotal() | number:'1.0-0' }} GNF</span>
                    </div>
                  }
                  @if (optLivraison()) {
                    <div class="flex justify-between text-muted-foreground">
                      <span>Livraison sur site</span>
                      <span>+200 000 GNF</span>
                    </div>
                  }
                  <div class="flex justify-between font-bold text-foreground pt-3 border-t border-border text-lg">
                    <span>Total</span>
                    <span class="text-primary">{{ grandTotal() | number:'1.0-0' }} GNF</span>
                  </div>
                </div>
              }

              <button (click)="rentTruck()" [disabled]="bookingInProgress() || !!dateConflict()"
                class="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors glow-amber disabled:opacity-50">
                @if (bookingInProgress()) {
                  Traitement en cours...
                } @else if (dateConflict()) {
                  Dates indisponibles
                } @else if (rentalDays() > 0 && t.pricePerDay) {
                  Confirmer &middot; {{ grandTotal() | number:'1.0-0' }} GNF
                } @else {
                  Confirmer la r&eacute;servation
                }
              </button>

              @if (bookingError()) {
                <p class="text-xs text-destructive text-center mt-3">{{ bookingError() }}</p>
              }
              @if (!authService.isAuthenticated()) {
                <p class="text-xs text-muted-foreground text-center mt-3">
                  <svg class="w-3.5 h-3.5 inline -mt-0.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Vous devez &ecirc;tre connect&eacute; pour r&eacute;server
                </p>
              }
            </div>
          </div>
        </div>
      } @else if (loadError()) {
        <div class="glass-card rounded-xl p-12 text-center max-w-lg mx-auto">
          <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 class="text-lg font-bold text-foreground mb-2">Camion introuvable</h2>
          <p class="text-sm text-muted-foreground mb-4">Ce camion n'est peut-&ecirc;tre plus disponible ou vous devez vous connecter</p>
          <div class="flex justify-center gap-3">
            <a routerLink="/trucks" class="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors inline-block">
              Voir les camions
            </a>
            @if (!authService.isAuthenticated()) {
              <button (click)="login()" class="px-6 py-2.5 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                Connexion
              </button>
            }
          </div>
        </div>
      } @else {
        <!-- Loading skeleton -->
        <div class="flex flex-col lg:flex-row gap-8">
          <div class="lg:w-[70%]">
            <div class="glass-card rounded-xl overflow-hidden animate-pulse mb-6">
              <div class="h-96 bg-muted"></div>
            </div>
            <div class="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div class="h-5 bg-muted rounded w-1/4 mb-8"></div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="h-24 bg-muted rounded-xl"></div>
              }
            </div>
          </div>
          <div class="hidden lg:block lg:w-[30%]">
            <div class="glass-card rounded-xl p-6 animate-pulse">
              <div class="h-6 bg-muted rounded w-2/3 mb-3"></div>
              <div class="h-8 bg-muted rounded w-1/2 mb-6"></div>
              <div class="space-y-4 mb-6">
                <div class="h-10 bg-muted rounded-lg"></div>
                <div class="h-10 bg-muted rounded-lg"></div>
              </div>
              <div class="h-12 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class TruckDetailComponent implements OnInit {
  id = input.required<string>();

  private truckService = inject(TruckService);
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);
  private locationService = inject(LocationService);
  authService = inject(AuthService);
  private router = inject(Router);
  apiUrl = environment.apiUrl;
  bookingInProgress = signal(false);
  bookingError = signal('');

  truck = signal<TruckResponse | null>(null);
  loadError = signal(false);
  currentPhoto = signal(0);
  private photoCount = computed(() => this.truck()?.photoUrls?.length ?? 0);

  // Locations
  locations = signal<LocationResponse[]>([]);
  selectedPickupLocationId = signal(0);
  selectedReturnLocationId = signal(0);

  // Unavailable periods
  unavailablePeriods = signal<{startDate: string, endDate: string}[]>([]);

  // Booking state
  startDate = signal('');
  endDate = signal('');
  optChauffeur = signal(false);
  optAssurance = signal(false);
  optMaintenance = signal(false);
  optLivraison = signal(false);

  rentalDays = computed(() => {
    const s = this.startDate();
    const e = this.endDate();
    if (!s || !e) return 0;
    const diff = new Date(e).getTime() - new Date(s).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  });

  baseTotal = computed(() => (this.truck()?.pricePerDay ?? 0) * this.rentalDays());
  chauffeurTotal = computed(() => 150_000 * this.rentalDays());
  assuranceTotal = computed(() => 75_000 * this.rentalDays());
  maintenanceTotal = computed(() => 50_000 * this.rentalDays());

  grandTotal = computed(() => {
    let total = this.baseTotal();
    if (this.optChauffeur()) total += this.chauffeurTotal();
    if (this.optAssurance()) total += this.assuranceTotal();
    if (this.optMaintenance()) total += this.maintenanceTotal();
    if (this.optLivraison()) total += 200_000;
    return total;
  });

  weeklyPrice = computed(() => {
    const p = this.truck()?.pricePerDay;
    return p ? Math.round(p * 7 * 0.9) : 0;
  });

  monthlyPrice = computed(() => {
    const p = this.truck()?.pricePerDay;
    return p ? Math.round(p * 30 * 0.8) : 0;
  });

  minDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  dateConflict = computed(() => {
    const s = this.startDate();
    const e = this.endDate();
    if (!s || !e) return '';
    const periods = this.unavailablePeriods();
    for (const p of periods) {
      if (s <= p.endDate && e >= p.startDate) {
        return `Dates indisponibles : du ${this.formatDate(p.startDate)} au ${this.formatDate(p.endDate)}`;
      }
    }
    return '';
  });

  protected formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  }

  ngOnInit() {
    const numId = parseInt(this.id(), 10);
    if (isNaN(numId)) {
      this.loadError.set(true);
      return;
    }
    this.truckService.getAvailableById(numId).subscribe({
      next: t => this.truck.set(t),
      error: () => this.loadError.set(true),
    });

    this.truckService.getUnavailableDates(numId).subscribe({
      next: periods => this.unavailablePeriods.set(periods),
    });

    // Charger les lieux et pré-sélectionner Conakry
    this.locationService.getAll().subscribe({
      next: (locs) => {
        const active = locs.filter(l => l.active);
        this.locations.set(active);
        const conakry = active.find(l => l.city.toLowerCase().includes('conakry'));
        const defaultId = conakry?.id ?? active[0]?.id ?? 0;
        this.selectedPickupLocationId.set(defaultId);
        this.selectedReturnLocationId.set(defaultId);
      },
    });
  }

  nextPhoto() { this.currentPhoto.update(i => (i + 1) % this.photoCount()); }
  prevPhoto() { this.currentPhoto.update(i => (i - 1 + this.photoCount()) % this.photoCount()); }
  goToPhoto(index: number) { this.currentPhoto.set(index); }

  rentTruck() {
    const t = this.truck();
    if (!t) return;

    const hasDates = this.startDate() && this.endDate();

    // Sauvegarder les données du formulaire avant redirection
    const bookingData = {
      truckId: t.id,
      startDate: this.startDate(),
      endDate: this.endDate(),
      pickupLocationId: this.selectedPickupLocationId(),
      returnLocationId: this.selectedReturnLocationId(),
      optChauffeur: this.optChauffeur(),
      optAssurance: this.optAssurance(),
      optMaintenance: this.optMaintenance(),
      optLivraison: this.optLivraison(),
    };
    sessionStorage.setItem('pendingBooking', JSON.stringify(bookingData));

    if (!this.authService.isAuthenticated()) {
      this.authService.login(window.location.origin + '/client/book?truckId=' + t.id);
      return;
    }

    // Si dates remplies : créer la réservation directement et rediriger vers le paiement
    if (hasDates) {
      const pickupId = this.selectedPickupLocationId();
      const returnId = this.selectedReturnLocationId();
      if (!pickupId || !returnId) {
        this.bookingError.set('Veuillez sélectionner les lieux de retrait et retour');
        return;
      }

      this.bookingInProgress.set(true);
      this.bookingError.set('');

      const extras: ExtraRequest[] = [];
      if (this.optChauffeur()) extras.push({ name: 'Chauffeur professionnel', pricePerDay: 150000 });
      if (this.optAssurance()) extras.push({ name: 'Assurance tous risques', pricePerDay: 75000 });
      if (this.optMaintenance()) extras.push({ name: 'Maintenance incluse', pricePerDay: 50000 });
      if (this.optLivraison()) extras.push({ name: 'Livraison sur site', pricePerDay: 200000 });

      this.bookingService.create({
        truckId: t.id,
        pickupLocationId: pickupId,
        returnLocationId: returnId,
        pickupDate: this.startDate(),
        returnDate: this.endDate(),
        extras,
      }).pipe(
        switchMap(booking => this.paymentService.initiatePayment(booking.id))
      ).subscribe({
        next: (payment) => {
          sessionStorage.removeItem('pendingBooking');
          window.location.href = payment.paymentUrl;
        },
        error: (err) => {
          this.bookingInProgress.set(false);
          this.bookingError.set(err.error?.message || 'Erreur lors de la réservation');
        },
      });
    } else {
      // Pas de dates : rediriger vers le formulaire complet
      this.router.navigate(['/client/book'], { queryParams: { truckId: t.id } });
    }
  }

  login() { this.authService.login(); }
}
