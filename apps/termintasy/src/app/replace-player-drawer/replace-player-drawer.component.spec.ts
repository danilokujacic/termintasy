import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplacePlayerDrawerComponent } from './replace-player-drawer.component';

describe('ReplacePlayerDrawerComponent', () => {
  let component: ReplacePlayerDrawerComponent;
  let fixture: ComponentFixture<ReplacePlayerDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplacePlayerDrawerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReplacePlayerDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
