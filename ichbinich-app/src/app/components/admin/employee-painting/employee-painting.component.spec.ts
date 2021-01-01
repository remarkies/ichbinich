import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePaintingComponent } from './employee-painting.component';

describe('EmployeePaintingComponent', () => {
  let component: EmployeePaintingComponent;
  let fixture: ComponentFixture<EmployeePaintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePaintingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeePaintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
