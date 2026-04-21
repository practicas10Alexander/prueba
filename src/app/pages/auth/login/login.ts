import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/app/firebase-config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="flex h-screen w-full flex-row-reverse bg-[#f8f6f6] dark:bg-[#0a0a0a] font-sans m-0 p-0 overflow-hidden">
  <!-- Left Side: Brand Identity (Deep Black) -->
  <div class="hidden md:flex md:w-1/2 lg:w-3/5 bg-[#0a0a0a] items-center justify-center p-12 border-l border-slate-800/30 relative overflow-hidden geometric-pattern">
    <!-- Subtle geometric pattern background -->
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1e3a8a] via-transparent to-transparent"></div>
    <div class="relative z-10 flex flex-col items-center gap-6">
      <div class="mb-4">
          <img src="layout/images/logo-white.svg" alt="Dapper Logo" class="w-32 h-32 object-contain" />
      </div>
      <div class="text-center">
        <h1 class="text-[#FFFFFF] text-5xl font-bold tracking-tight mb-2">
          PM DapperTechnologies
        </h1>
      </div>
      <div class="mt-6 h-1 w-24 bg-[#FFFFFF]/60 rounded-full"></div>
    </div>
  </div>
  <!-- Right Side: Login Panel (Dark Grey/Black) -->
  <div class="flex flex-1 w-full md:w-1/2 lg:w-2/5 bg-[#121212] items-center justify-center px-6 md:px-20 lg:px-24">
    <div class="w-full max-w-[420px] flex flex-col">

      <div class="lg:hidden flex flex-col items-center mb-10">
        <div class="mb-2">
            <img src="layout/images/logo-white.svg" alt="Dapper Logo" class="w-16 h-16 object-contain" />
        </div>
        <h2 class="text-[#FFFFFF] text-2xl font-bold">PM DapperTechnologies</h2>
      </div>

      <!-- VISTA DE LOGIN -->
      <ng-container *ngIf="!showForgotForm">
        <div class="mb-10 animate-fade-in">
          <h3 class="text-slate-100 text-3xl font-bold mb-2">Bienvenido</h3>
          <p class="text-[#FFFFFF]/70 text-sm">Ingrese sus claves de acceso para acceder a la plataforma.</p>
        </div>

        <form class="space-y-6 animate-fade-in" (ngSubmit)="login()">
          <!--Alerta de error -->
          <div *ngIf="loginError" class="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Username Input -->
          <div class="flex flex-col gap-2">
            <label class="text-slate-300 text-sm font-semibold tracking-wide" for="usuario">
              Usuario*
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFFFFF]/40 group-focus-within:text-[#1e3a8a] transition-colors">
                <span class="material-symbols-outlined !text-xl">person</span>
              </div>
              <input 
                [(ngModel)]="email" 
                name="email" 
                class="w-full bg-[#1e1e1e] border text-slate-100 placeholder:text-[#FFFFFF]/40 rounded-xl h-14 pl-12 pr-4 text-base transition-all outline-none" 
                [ngClass]="loginError ? 'border-red-500 ring-2 ring-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-transparent focus:border-[#1e3a8a]/50 focus:ring-2 focus:ring-[#1e3a8a]/50'"
                id="usuario" 
                placeholder="Ingrese su usuario" 
                type="text" 
                required/>
            </div>
          </div>

          <!-- Password Input -->
          <div class="flex flex-col gap-2">
            <label class="text-slate-300 text-sm font-semibold tracking-wide" for="password">
              Contraseña*
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFFFFF]/40 group-focus-within:text-[#1e3a8a] transition-colors">
                <span class="material-symbols-outlined !text-xl">lock</span>
              </div>
              <input 
                [(ngModel)]="password" 
                name="password" 
                class="w-full bg-[#1e1e1e] border text-slate-100 placeholder:text-[#FFFFFF]/40 rounded-xl h-14 pl-12 pr-12 text-base transition-all outline-none" 
                [ngClass]="loginError ? 'border-red-500 ring-2 ring-red-500/50 focus:border-red-500 focus:ring-red-500/50' : 'border-transparent focus:border-[#1e3a8a]/50 focus:ring-2 focus:ring-[#1e3a8a]/50'"
                id="password" 
                placeholder="Ingrese su contraseña" 
                [type]="showPassword ? 'text' : 'password'" 
                required/>
              <button 
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer" 
                type="button" 
                tabindex="-1"
                (click)="togglePasswordVisibility()">
                <span class="material-symbols-outlined !text-xl">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div class="flex justify-end">
              <a (click)="toggleForgotForm(true)" class="text-[#FFFFFF]/70 text-xs font-semibold hover:underline cursor-pointer" tabindex="-1">¿Olvidó su contraseña?</a>
            </div>
          </div>

          <!-- Login Button -->
          <div class="pt-4">
            <button 
              class="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1e3a8a]/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
              type="submit"
              [disabled]="isLoading">
              <span *ngIf="!isLoading">Ingresar</span>
              <span *ngIf="isLoading">Iniciando sesión...</span>
              <span class="material-symbols-outlined !text-xl animate-spin" *ngIf="isLoading">sync</span>
              <span class="material-symbols-outlined !text-xl" *ngIf="!isLoading">login</span>
            </button>
          </div>
        </form>
      </ng-container>

      <!-- VISTA DE RECUPERAR CONTRASEÑA -->
      <ng-container *ngIf="showForgotForm">
        <div class="mb-10 animate-fade-in">
          <h3 class="text-slate-100 text-3xl font-bold mb-2">Recuperar Acceso</h3>
          <p class="text-[#FFFFFF]/70 text-sm">Le enviaremos un correo electrónico con instrucciones para restablecer su contraseña.</p>
        </div>

        <form class="space-y-6 animate-fade-in" (ngSubmit)="sendRecoveryEmail()">
          <!-- Alerta de éxito -->
          <div *ngIf="recoverySuccess" class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            <span>Correo de recuperación enviado con éxito.</span>
          </div>

          <!-- Alerta de error -->
          <div *ngIf="loginError" class="bg-red-500/10 border border-red-500/20 text-red-500 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Recovery Email Input -->
          <div class="flex flex-col gap-2">
            <label class="text-slate-300 text-sm font-semibold tracking-wide" for="recoveryEmail">
              Correo Electrónico*
            </label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFFFFF]/40 group-focus-within:text-[#1e3a8a] transition-colors">
                <span class="material-symbols-outlined !text-xl">mail</span>
              </div>
              <input 
                [(ngModel)]="recoveryEmail" 
                name="recoveryEmail" 
                class="w-full bg-[#1e1e1e] border text-slate-100 placeholder:text-[#FFFFFF]/40 rounded-xl h-14 pl-12 pr-4 text-base transition-all outline-none" 
                [ngClass]="loginError ? 'border-red-500 ring-2 ring-red-500/50' : 'border-transparent focus:border-[#1e3a8a]/50 focus:ring-2 focus:ring-[#1e3a8a]/50'"
                id="recoveryEmail" 
                placeholder="Introduce tu correo" 
                type="email" 
                required/>
            </div>
          </div>

          <div class="flex flex-col gap-3 pt-4">
            <button 
              class="w-full bg-[#1e3a8a] hover:bg-[#1e3a8a]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1e3a8a]/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
              type="submit"
              [disabled]="isLoading || recoverySuccess">
              <span *ngIf="!isLoading">Enviar enlace de recuperación</span>
              <span *ngIf="isLoading">Enviando...</span>
              <span class="material-symbols-outlined !text-xl animate-spin" *ngIf="isLoading">sync</span>
            </button>

            <button 
              class="w-full bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2" 
              type="button"
              (click)="toggleForgotForm(false)">
              <span class="material-symbols-outlined text-lg">arrow_back</span>
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </ng-container>

      <div class="mt-10 border-t border-slate-800/50 pt-8 flex justify-center">
        <p class="text-[#FFFFFF]/40 text-xs text-center leading-relaxed">
              Desarrollado para la gestión de DapperTechnologies.
        </p>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');
    
    :host {
      display: block;
      min-height: 100vh;
      width: 100%;
      font-family: 'Public Sans', sans-serif;
    }

    .animate-fade-in {
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .geometric-pattern {
      background-color: #0d0d0d;
      background-image: linear-gradient(30deg, #141414 12%, transparent 12.5%, transparent 87%, #141414 87.5%, #141414),
                        linear-gradient(150deg, #141414 12%, transparent 12.5%, transparent 87%, #141414 87.5%, #141414),
                        linear-gradient(30deg, #141414 12%, transparent 12.5%, transparent 87%, #141414 87.5%, #141414),
                        linear-gradient(150deg, #141414 12%, transparent 12.5%, transparent 87%, #141414 87.5%, #141414),
                        linear-gradient(60deg, #181818 25%, transparent 25.5%, transparent 75%, #181818 75%, #181818),
                        linear-gradient(60deg, #181818 25%, transparent 25.5%, transparent 75%, #181818 75%, #181818);
      background-size: 80px 140px;
      background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
    }

    .material-symbols-outlined {
      font-variation-settings:
      'FILL' 0,
      'wght' 400,
      'GRAD' 0,
      'opsz' 24;
    }
  `]
})
export class Login {
  email = '';
  password = '';
  loginError = false;
  showPassword = false;
  isLoading = false;
  errorMessage = 'Usuario/Contraseña incorrectos.';

  // Forgot password props
  showForgotForm = false;
  recoveryEmail = '';
  recoverySuccess = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  toggleForgotForm(show: boolean) {
    this.showForgotForm = show;
    this.loginError = false;
    this.errorMessage = '';
    this.recoverySuccess = false;
    this.recoveryEmail = this.email; // Pre-fill with what has been typed in login
  }

  async sendRecoveryEmail() {
    if (this.isLoading) return;

    if (!this.recoveryEmail || !this.recoveryEmail.includes('@')) {
      this.errorMessage = 'Por favor, ingrese un correo electrónico válido.';
      this.loginError = true;
      return;
    }

    this.isLoading = true;
    this.loginError = false;
    this.recoverySuccess = false;

    try {
      await sendPasswordResetEmail(auth, this.recoveryEmail);
      this.recoverySuccess = true;
    } catch (error: any) {
      console.error('Recovery error:', error);
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'No existe un usuario registrado con este correo.';
      } else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'El formato del correo no es válido.';
      } else {
        this.errorMessage = 'Ocurrió un error al enviar el correo. Intente más tarde.';
      }
      this.loginError = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async login() {
    if (this.isLoading) return;

    // Validación básica rápida en el frontend
    if (!this.email || !this.email.includes('@')) {
      this.errorMessage = 'Por favor, ingrese un correo electrónico válido.';
      this.loginError = true;
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Por favor, ingrese su contraseña.';
      this.loginError = true;
      return;
    }

    this.isLoading = true;
    this.loginError = false;
    this.errorMessage = 'Usuario o contraseña incorrectos.';

    try {
      const result = await this.authService.login(this.email, this.password);

      if (!result.success) {
        switch (result.errorCode) {
          case 'auth/invalid-email':
            this.errorMessage = 'El correo electrónico ingresado no es válido.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            this.errorMessage = 'Usuario o contraseña incorrectos.';
            break;
          case 'auth/too-many-requests':
            this.errorMessage = 'Demasiados intentos fallidos. Su cuenta ha sido bloqueada temporalmente.';
            break;
          case 'auth/network-request-failed':
            this.errorMessage = 'Error de conexión. Verifique su internet.';
            break;
          default:
            this.errorMessage = 'Error al iniciar sesión. Intente de nuevo.';
            break;
        }
        this.loginError = true;
      }
    } catch (err) {
      console.error('Error inesperado en el componente Login:', err);
      this.errorMessage = 'Ocurrió un error inesperado. Intente de nuevo.';
      this.loginError = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // Forzar actualización de UI
      console.log('Login finalizado. isLoading:', this.isLoading);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
