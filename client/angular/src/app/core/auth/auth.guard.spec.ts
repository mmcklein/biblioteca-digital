import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  it('permite el acceso si el usuario está autenticado', () => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: { parseUrl: (url: string) => url },
        },
      ],
    });

    const auth = TestBed.inject(AuthService);
    // Iniciar sesión con un usuario activo (ej. estudiante)
    auth.loginWithUsername('estudiante.juan');

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('bloquea y redirige a /login si no hay usuario autenticado', () => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: Router,
          useValue: { parseUrl: (url: string) => `/redirected-to${url}` },
        },
      ],
    });

    const auth = TestBed.inject(AuthService);
    auth.logout();

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe('/redirected-to/login');
  });
});
