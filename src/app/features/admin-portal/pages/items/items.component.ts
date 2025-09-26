import { Component } from '@angular/core';
import { TableComponent } from '@shared/components/table/table.component';

@Component({
  selector: 'app-items',
  imports: [TableComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
})
export class ItemsComponent {}
