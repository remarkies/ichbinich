import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaintingComponent } from './new-painting.component';

describe('NewPaintingComponent', () => {
  let component: NewPaintingComponent;
  let fixture: ComponentFixture<NewPaintingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPaintingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
