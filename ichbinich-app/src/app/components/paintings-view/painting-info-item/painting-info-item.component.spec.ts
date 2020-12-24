import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintingInfoItemComponent } from './painting-info-item.component';

describe('InfoItemComponent', () => {
  let component: PaintingInfoItemComponent;
  let fixture: ComponentFixture<PaintingInfoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaintingInfoItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintingInfoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
