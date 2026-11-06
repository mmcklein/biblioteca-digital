import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AuthService } from '../../core/auth/auth.service';
import { Perfil } from './perfil';

describe('Perfil Component', () => {
  it('se crea correctamente', () => {
    TestBed.configureTestingModule({
      imports: [Perfil],
      providers: [AuthService],
    });

    const fixture = TestBed.createComponent(Perfil);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('permite iniciar edición y guardar cambios del usuario', () => {
    TestBed.configureTestingModule({
      imports: [Perfil],
      providers: [AuthService],
    });

    const auth = TestBed.inject(AuthService);
    auth.loginWithUsername('estudiante.juan');

    const fixture = TestBed.createComponent(Perfil);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    (component as any).startEdit();
    expect((component as any).editMode).toBe(true);

    (component as any).nameInput = 'Juan Huamán Actualizado';
    (component as any).interestsInput = 'Astronomía, Robótica';
    (component as any).saveProfile();

    expect((component as any).editMode).toBe(false);
    expect(auth.currentUser()?.name).toBe('Juan Huamán Actualizado');
    expect(auth.currentUser()?.readingInterests).toContain('Astronomía');
  });
});

