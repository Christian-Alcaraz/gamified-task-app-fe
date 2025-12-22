import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  EUiState,
  ITEM_ATTRIBUTES,
  ITEM_BASE_STATS,
  ITEM_RARITIES,
  ITEM_SOURCES,
  ITEM_TYPES,
  ITEM_USAGE_ATTRIBUTES,
} from '@core/constants';
import { Item } from '@core/models/item.model';
import { NgIcon } from '@ng-icons/core';
import {
  BaseDialog,
  DialogActionsDirective,
  DialogContentDirective,
  DialogTitleDirective,
  IBaseDialogData,
} from '@shared/components/dialog';
import { DialogCloseButtonComponent } from '@shared/components/dialog/dialog-close-button.component';
import {
  SelectFieldComponent,
  TextFieldComponent,
} from '@shared/components/inputs';
import ComboboxChipsFieldComponent from '@shared/components/inputs/combobox-chips-field/combobox-chips-field.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { ItemApiService } from '@shared/services/api/item/item.api.service';
import { finalize, Observable, of } from 'rxjs';
import { BaseStatsFieldComponent } from './base-stats-field/base-stats-field.component';

interface IItemDialogData extends IBaseDialogData {
  item?: Item;
}

@Component({
  selector: 'app-upsert-item-dialog',
  imports: [
    CommonModule,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    ReactiveFormsModule,
    DialogCloseButtonComponent,
    TextFieldComponent,
    SelectFieldComponent,
    ComboboxChipsFieldComponent,
    BaseStatsFieldComponent,
    NgIcon,
  ],
  templateUrl: './upsert-item-dialog.component.html',
  styleUrl: './upsert-item-dialog.component.scss',
})
export class UpsertItemDialogComponent extends BaseDialog<IItemDialogData> {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly apiService = inject(ItemApiService);

  itemForm!: FormGroup;
  readonly sources = ITEM_SOURCES;
  readonly attributes = ITEM_ATTRIBUTES;
  readonly usageAttributes = ITEM_USAGE_ATTRIBUTES;
  readonly types = ITEM_TYPES;
  readonly baseStats = ITEM_BASE_STATS;
  readonly rarities = ITEM_RARITIES;
  readonly allBaseStats = ITEM_BASE_STATS;

  baseStatsValue!: Record<string, number>[];
  loading = signal(false);

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
      this.itemForm.patchValue(item, { emitEvent: false });

      if (item.baseStats) {
        this.baseStatsValue = item.baseStats;
      }
    }
  }

  override closeDialog(data?: Item | undefined): void {
    if (this.loading()) return;
    super.closeDialog(data);
  }

  submit() {
    this.itemForm.markAllAsTouched();
    this.itemForm.markAllAsDirty();

    if (!this.itemForm.valid) {
      this.toastService.showToast(
        'Error',
        'Please fill out all required fields.',
        EUiState.Error,
      );
      return;
    }

    this.loading.update(() => true);
    const apiCall = this.data.item ? this._updateItem() : this._createItem();
    apiCall
      .pipe(
        finalize(() => {
          this.loading.update(() => false);
        }),
      )
      .subscribe({
        next: (item) => {
          this.loading.update(() => false);
          this.closeDialog(item);
        },
        error: ({ error }) => {
          this.toastService.showToast(
            `Error ${error.code}`,
            error.message,
            EUiState.Error,
          );
        },
      });
  }

  private _createItem(): Observable<Item> {
    const item = this.itemForm.getRawValue();
    return this.apiService.createItem(item);
  }

  private _updateItem(): Observable<Item> {
    console.log('updateItem', {
      pristine: this.itemForm.pristine,
      dirty: this.itemForm.dirty,
    });
    if (this.itemForm.pristine) {
      console.log('update no changes should not api call');
      return of(this.data.item) as Observable<Item>;
    }
    const item = this.data.item;
    const form = this.itemForm.getRawValue();
    return this.apiService.updateItem(form, item!._id as string);
  }
}
