import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChipRendererComponent } from './chip-renderer.component';

describe('ChipRendererComponent', () => {
  let component: ChipRendererComponent;
  let fixture: ComponentFixture<ChipRendererComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChipRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
