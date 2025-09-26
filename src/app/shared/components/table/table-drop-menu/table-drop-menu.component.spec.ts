import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDropMenuComponent } from './table-drop-menu.component';

describe('TableDropMenuComponent', () => {
  let component: TableDropMenuComponent;
  let fixture: ComponentFixture<TableDropMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableDropMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableDropMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
