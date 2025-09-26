import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableActionButtonComponent } from './table-action-button.component';

describe('TableActionButtonComponent', () => {
  let component: TableActionButtonComponent;
  let fixture: ComponentFixture<TableActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableActionButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
