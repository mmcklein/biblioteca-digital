import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { ROLE_LABELS } from '../../core/user.model';

@Component({
  selector: 'app-perfil',
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil {
  protected readonly auth = inject(AuthService);
  protected readonly roleLabels = ROLE_LABELS;

  protected editMode = false;
  protected successMsg = '';
  protected errorMsg = '';

  // Campos editables
  protected nameInput = '';
  protected emailInput = '';
  protected phoneInput = '';
  protected interestsInput = '';

  protected startEdit(): void {
    const u = this.auth.currentUser();
    if (!u) return;
    this.nameInput = u.name;
    this.emailInput = u.email ?? '';
    this.phoneInput = u.phone ?? '';
    this.interestsInput = (u.readingInterests ?? []).join(', ');
    this.editMode = true;
    this.successMsg = '';
    this.errorMsg = '';
  }

  protected cancelEdit(): void {
    this.editMode = false;
    this.errorMsg = '';
  }

  protected saveProfile(): void {
    const u = this.auth.currentUser();
    if (!u) return;
    const name = this.nameInput.trim();
    if (!name) {
      this.errorMsg = 'El nombre no puede estar vacío.';
      return;
    }
    const interests = this.interestsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    this.auth.updateUser(u.id, {
      name,
      email: this.emailInput.trim() || undefined,
      phone: this.phoneInput.trim() || undefined,
      readingInterests: interests.length > 0 ? interests : undefined,
    });
    this.editMode = false;
    this.successMsg = 'Perfil actualizado correctamente.';
    this.errorMsg = '';
  }
}

