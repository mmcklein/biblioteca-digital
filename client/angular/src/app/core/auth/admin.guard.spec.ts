import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthService } from './auth.service';
import { INITIAL_USERS } from '../user.model';

describe('adminGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access if user is ADMINISTRADOR', () => {
    authService.loginAs(INITIAL_USERS[0]); // admin
    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('should redirect to /login if user is not ADMINISTRADOR', () => {
    const estudiante = INITIAL_USERS.find((u) => u.role === 'ESTUDIANTE')!;
    authService.loginAs(estudiante);

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).not.toBe(true);
  });
});

