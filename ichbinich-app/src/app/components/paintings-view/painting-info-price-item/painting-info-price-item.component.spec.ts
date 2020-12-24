import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintingInfoPriceItemComponent } from './painting-info-price-item.component';

describe('PaintingInfoPriceItemComponent', () => {
  let component: PaintingInfoPriceItemComponent;
  let fixture: ComponentFixture<PaintingInfoPriceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaintingInfoPriceItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintingInfoPriceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
