import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerViewDrawerComponent } from './player-view-drawer.component';

describe('PlayerViewDrawerComponent', () => {
  let component: PlayerViewDrawerComponent;
  let fixture: ComponentFixture<PlayerViewDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerViewDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerViewDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
