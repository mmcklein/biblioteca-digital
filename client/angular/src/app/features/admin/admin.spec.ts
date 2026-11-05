import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Admin } from './admin';
import { AuthService } from '../../core/auth/auth.service';
import { INITIAL_USERS } from '../../core/user.model';

describe('Admin Component', () => {
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [provideRouter([])],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    authService.loginAs(INITIAL_USERS[0]); // Administrador
  });

  it('should create the admin component', () => {
    const fixture = TestBed.createComponent(Admin);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display the admin navigation tabs', () => {
    const fixture = TestBed.createComponent(Admin);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const tabs = compiled.querySelectorAll('.tab-btn');
    expect(tabs.length).toBe(6);
  });
});

