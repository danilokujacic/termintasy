import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCreateGameComponent } from './admin-create-game.component';

describe('AdminCreateGameComponent', () => {
  let component: AdminCreateGameComponent;
  let fixture: ComponentFixture<AdminCreateGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateGameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCreateGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
