import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { INSTITUTION } from '../../../core/institution';
import { ROLE_LABELS, type User } from '../../../core/user.model';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly institution = INSTITUTION;
  protected readonly roleLabels = ROLE_LABELS;

  protected usernameInput = '';
  protected errorMessage = '';

  protected onLoginSubmit(): void {
    this.errorMessage = '';
    const success = this.auth.loginWithUsername(this.usernameInput);
    if (success) {
      this.navigatePostLogin();
    } else {
      this.errorMessage = 'Usuario no encontrado o cuenta desactivada. Verifica el nombre ingresado.';
    }
  }

  protected selectProfile(user: User): void {
    this.errorMessage = '';
    const success = this.auth.loginAs(user);
    if (success) {
      this.navigatePostLogin();
    } else {
      this.errorMessage = 'Esta cuenta se encuentra inactiva.';
    }
  }

  private navigatePostLogin(): void {
    if (this.auth.isAdmin()) {
      void this.router.navigate(['/admin']);
    } else if (this.auth.isDocente()) {
      void this.router.navigate(['/docente']);
    } else if (this.auth.isEstudiante()) {
      void this.router.navigate(['/estudiante']);
    } else if (this.auth.isPadre()) {
      void this.router.navigate(['/padre']);
    } else {
      void this.router.navigate(['/inicio']);
    }
  }
}
