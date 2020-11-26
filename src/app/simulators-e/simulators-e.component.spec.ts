import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulatorsEComponent } from './simulators-e.component';

describe('SimulatorsEComponent', () => {
  let component: SimulatorsEComponent;
  let fixture: ComponentFixture<SimulatorsEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimulatorsEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulatorsEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
