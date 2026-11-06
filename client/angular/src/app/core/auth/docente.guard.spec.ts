import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { docenteGuard } from './docente.guard';
import { AuthService } from './auth.service';
import { INITIAL_USERS } from '../user.model';

describe('docenteGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access if user is DOCENTE', () => {
    const docente = INITIAL_USERS.find((u) => u.role === 'DOCENTE')!;
    authService.loginAs(docente);

    const result = TestBed.runInInjectionContext(() => docenteGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should allow access if user is ADMINISTRADOR', () => {
    const admin = INITIAL_USERS.find((u) => u.role === 'ADMINISTRADOR')!;
    authService.loginAs(admin);

    const result = TestBed.runInInjectionContext(() => docenteGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should redirect if user is ESTUDIANTE or PADRE_FAMILIA', () => {
    const estudiante = INITIAL_USERS.find((u) => u.role === 'ESTUDIANTE')!;
    authService.loginAs(estudiante);

    const result = TestBed.runInInjectionContext(() => docenteGuard({} as any, {} as any));
    expect(result).not.toBe(true);
  });
});

