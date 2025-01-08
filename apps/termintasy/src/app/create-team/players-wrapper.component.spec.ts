import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayersWrapperComponent } from './players-wrapper.component';

describe('PlayersWrapperComponent', () => {
  let component: PlayersWrapperComponent;
  let fixture: ComponentFixture<PlayersWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayersWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
