import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminGameUpdateComponent } from './admin-game-update.component';

describe('AdminGameUpdateComponent', () => {
  let component: AdminGameUpdateComponent;
  let fixture: ComponentFixture<AdminGameUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGameUpdateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminGameUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
