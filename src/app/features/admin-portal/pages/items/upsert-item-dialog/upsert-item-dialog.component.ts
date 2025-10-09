import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { InputService } from '@shared/components/inputs';
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
    // TextFieldComponent,
    // SelectFieldComponent,
    // ComboboxChipsFieldComponent,
    BaseStatsFieldComponent,
  ],
  templateUrl: './upsert-item-dialog.component.html',
  styleUrl: './upsert-item-dialog.component.scss',
})
export class UpsertItemDialogComponent extends BaseDialog<ItemDialogData> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly inputService = inject(InputService);

  itemForm!: FormGroup;
  readonly sources = ItemConst.Sources;
  readonly attributes = ItemConst.Attributes;
  readonly usageAttributes = ItemConst.UsageAttributes;
  readonly itemTypeIndex = ItemConst.TypeIndex;
  readonly types = ItemConst.Types;
  readonly baseStats = ItemConst.BaseStats;
  readonly rarities = ItemConst.Rarities;
  readonly allBaseStats = ItemConst.AllBaseStats;

  readonly testBaseStats: Record<string, number>[] = [
    { strength: 25 },
    { dexterity: 60 },
    { constitution: 30 },
  ];

  //Todo: Dynamic validations:
  //* maxStackSize -> required/only appears if [attributes] includes 'stackable'.
  //* cost -> required if [sources] includes 'shop'.
  //* type = 'consumable': [attributes] -> 'stackable' is required/autofill; 'tradeable' and 'craftable' are in the list.
  //* type = other than consumable: [attributes] -> 'equippable' is required/autofill; 'consumable' is not in the list.

  constructor() {
    super();

    this.itemForm = this.formBuilder.group({
      // name: ['', Validators.required],
      // description: [''],
      // type: ['', Validators.required],
      // attributes: [''],
      // usageAttributes: [''],
      // sources: ['', Validators.required],
      // cost: [0],
      // maxStackSize: [0],
      baseStats: this.formBuilder.array([]),
    });
  }

  submit() {
    console.log(this.itemForm.valid, this.itemForm.getRawValue());
  }
}
