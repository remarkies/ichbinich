import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePaintingsComponent } from './employee-paintings.component';

describe('EmployeePaintingsComponent', () => {
  let component: EmployeePaintingsComponent;
  let fixture: ComponentFixture<EmployeePaintingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePaintingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePaintingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
