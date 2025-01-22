import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerStatItemComponent } from './player-stat-item.component';

describe('PlayerStatItemComponent', () => {
  let component: PlayerStatItemComponent;
  let fixture: ComponentFixture<PlayerStatItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerStatItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerStatItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
