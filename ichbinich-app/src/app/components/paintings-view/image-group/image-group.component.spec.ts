import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageGroupComponent } from './image-group.component';

describe('ImageGroupComponent', () => {
  let component: ImageGroupComponent;
  let fixture: ComponentFixture<ImageGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
