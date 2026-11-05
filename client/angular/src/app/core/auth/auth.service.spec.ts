import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { INITIAL_USERS } from '../user.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    // Asegurar que parta del estado inicial
    service.loginAs(INITIAL_USERS[0]);
  });

  it('should be created and default to admin', () => {
    expect(service).toBeTruthy();
    expect(service.isAdmin()).toBe(true);
    expect(service.currentRole()).toBe('ADMINISTRADOR');
  });

  it('should switch roles when loginAs is called', () => {
    const docente = INITIAL_USERS.find((u) => u.role === 'DOCENTE')!;
    service.loginAs(docente);

    expect(service.isAdmin()).toBe(false);
    expect(service.isDocente()).toBe(true);
    expect(service.currentRole()).toBe('DOCENTE');
  });

  it('should allow admin to create a new user', () => {
    const initialCount = service.users().length;
    const newUser = service.createUser({
      username: 'docente.nuevo',
      name: 'Prof. Pedro Paredes',
      role: 'DOCENTE',
      areaId: 2,
    });

    expect(newUser.id).toBeGreaterThan(0);
    expect(service.users().length).toBe(initialCount + 1);
    expect(service.users().some((u) => u.username === 'docente.nuevo')).toBe(true);
  });

  it('should allow admin to toggle user active status and assign roles', () => {
    const target = service.users()[1];
    const initialStatus = target.active;

    service.toggleUserActive(target.id);
    expect(service.users().find((u) => u.id === target.id)?.active).toBe(!initialStatus);

    service.assignRole(target.id, 'ADMINISTRADOR');
    expect(service.users().find((u) => u.id === target.id)?.role).toBe('ADMINISTRADOR');
  });
});

