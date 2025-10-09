import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolledStatsFieldComponent } from './rolled-stats-field.component';

describe('RolledStatsFieldComponent', () => {
  let component: RolledStatsFieldComponent;
  let fixture: ComponentFixture<RolledStatsFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolledStatsFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolledStatsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
