import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseStatsFieldComponent } from './base-stats-field.component';

describe('BaseStatsFieldComponent', () => {
  let component: BaseStatsFieldComponent;
  let fixture: ComponentFixture<BaseStatsFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseStatsFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseStatsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
