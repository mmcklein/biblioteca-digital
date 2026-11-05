import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Actividades } from './actividades';

describe('Actividades Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actividades],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Actividades);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should list activity cards', async () => {
    const fixture = TestBed.createComponent(Actividades);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.activity-card');
    expect(cards.length).toBeGreaterThan(0);
  });
});

