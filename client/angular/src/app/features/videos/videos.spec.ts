import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Videos } from './videos';

describe('Videos Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Videos],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Videos);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should list video cards', async () => {
    const fixture = TestBed.createComponent(Videos);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.video-card');
    expect(cards.length).toBeGreaterThan(0);
  });
});

