import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintingInfoComponent } from './painting-info.component';

describe('PaintingInfoComponent', () => {
  let component: PaintingInfoComponent;
  let fixture: ComponentFixture<PaintingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaintingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
