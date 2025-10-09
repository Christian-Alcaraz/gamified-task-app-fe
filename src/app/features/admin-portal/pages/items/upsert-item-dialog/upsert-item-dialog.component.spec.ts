import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertItemDialogComponent } from './upsert-item-dialog.component';

describe('UpsertItemDialogComponent', () => {
  let component: UpsertItemDialogComponent;
  let fixture: ComponentFixture<UpsertItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpsertItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
