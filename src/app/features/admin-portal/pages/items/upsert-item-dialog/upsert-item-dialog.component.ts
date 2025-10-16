import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Item as ItemConst } from '@core/constants/item.constant';
import { Item } from '@core/models/item.model';
import {
  BaseDialog,
  BaseDialogData,
  DialogActionsDirective,
  DialogContentDirective,
  DialogTitleDirective,
} from '@shared/components/dialog';
import { DialogCloseButtonComponent } from '@shared/components/dialog/dialog-close-button.component';
import {
  InputService,
  SelectFieldComponent,
  TextFieldComponent,
} from '@shared/components/inputs';
import ComboboxChipsFieldComponent from '@shared/components/inputs/combobox-chips-field/combobox-chips-field.component';
import { ItemApiService } from '@shared/services/api/item/item.api.service';
import { Observable } from 'rxjs';
import { BaseStatsFieldComponent } from './base-stats-field/base-stats-field.component';

interface ItemDialogData extends BaseDialogData {
  item?: Item;
}

@Component({
  selector: 'app-upsert-item-dialog',
  imports: [
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ReactiveFormsModule,
    DialogCloseButtonComponent,
    TextFieldComponent,
    SelectFieldComponent,
    ComboboxChipsFieldComponent,
    BaseStatsFieldComponent,
  ],
  templateUrl: './upsert-item-dialog.component.html',
  styleUrl: './upsert-item-dialog.component.scss',
})
export class UpsertItemDialogComponent extends BaseDialog<ItemDialogData> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly inputService = inject(InputService);
  private readonly apiService = inject(ItemApiService);

  itemForm!: FormGroup;
  readonly sources = ItemConst.Sources;
  readonly attributes = ItemConst.Attributes;
  readonly usageAttributes = ItemConst.UsageAttributes;
  readonly types = ItemConst.Types;
  readonly baseStats = ItemConst.BaseStats;
  readonly rarities = ItemConst.Rarities;
  readonly allBaseStats = ItemConst.AllBaseStats;

  baseStatsValue!: Record<string, number>[];

  //Todo: Dynamic validations:
  //* maxStackSize -> required/only appears if [attributes] includes 'stackable'.
  //* cost -> required if [sources] includes 'shop'.
  //* type = 'consumable': [attributes] -> 'stackable' is required/autofill; 'tradeable' and 'craftable' are in the list.
  //* type = other than consumable: [attributes] -> 'equippable' is required/autofill; 'consumable' is not in the list.

  constructor() {
    super();

    const { item } = this.data;

    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      // attributes: [''],
      // usageAttributes: [''],
      sources: ['', Validators.required],
      // cost: [0],
      // maxStackSize: [0],
      baseStats: this.formBuilder.array([]),
    });

    if (item) {
      this.itemForm.patchValue(item);

      if (item.baseStats) {
        this.baseStatsValue = item.baseStats;
      }
    }
  }

  submit() {
    console.log(this.itemForm.valid, this.itemForm.getRawValue());

    if (this.data.item) {
      this._updateItem().subscribe({
        next: (item) => {
          this.closeDialog(item);
        },
        error: (error) => {
          console.error('Error updating item:', error);
        },
      });
    } else {
      this._createItem().subscribe({
        next: (item) => {
          this.closeDialog(item);
        },
        error: (error) => {
          console.error('Error creating item:', error);
        },
      });
    }
  }

  private _createItem(): Observable<Item> {
    const item = this.itemForm.getRawValue();
    return this.apiService.createItem(item);
  }

  private _updateItem(): Observable<Item> {
    const item = this.data.item;
    const form = this.itemForm.getRawValue();
    return this.apiService.updateItem(form, item!._id as string);
  }
}
