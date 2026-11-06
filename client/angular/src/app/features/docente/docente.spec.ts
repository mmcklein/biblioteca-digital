import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Docente } from './docente';
import { AuthService } from '../../core/auth/auth.service';
import { INITIAL_USERS } from '../../core/user.model';

describe('Docente Component', () => {
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Docente],
      providers: [provideRouter([])],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    const docente = INITIAL_USERS.find((u) => u.role === 'DOCENTE')!;
    authService.loginAs(docente);
  });

  it('should create the Docente component', () => {
    const fixture = TestBed.createComponent(Docente);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the navigation tabs for the teacher', () => {
    const fixture = TestBed.createComponent(Docente);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const tabs = compiled.querySelectorAll('.tab-btn');
    expect(tabs.length).toBe(3);
  });
});

