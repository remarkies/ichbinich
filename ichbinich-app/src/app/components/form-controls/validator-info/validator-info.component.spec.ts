import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorInfoComponent } from './validator-info.component';

describe('ValidatorInfoComponent', () => {
  let component: ValidatorInfoComponent;
  let fixture: ComponentFixture<ValidatorInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatorInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
