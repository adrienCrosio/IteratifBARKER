import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiAlignedChartComponent } from './multi-aligned-chart.component';

describe('MultiAlignedChartComponent', () => {
  let component: MultiAlignedChartComponent;
  let fixture: ComponentFixture<MultiAlignedChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiAlignedChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiAlignedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
