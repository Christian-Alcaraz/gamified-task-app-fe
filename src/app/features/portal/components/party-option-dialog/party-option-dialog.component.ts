import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import {
  BaseDialog,
  DialogContentDirective,
  DialogTitleDirective,
  IBaseDialogData,
} from '@shared/components/dialog';
import { DialogCloseButtonComponent } from '@shared/components/dialog/dialog-close-button.component';
import { provideBaseDialogToken } from '@shared/components/dialog/dialog.provider';

@Component({
  selector: 'app-party-option-dialog',
  imports: [
    CommonModule,
    DialogTitleDirective,
    DialogContentDirective,
    DialogCloseButtonComponent,
    NgIcon,
  ],
  providers: [provideBaseDialogToken(PartyOptionDialogComponent)],
  templateUrl: './party-option-dialog.component.html',
  styleUrl: './party-option-dialog.component.scss',
})
export class PartyOptionDialogComponent extends BaseDialog<IBaseDialogData> {
  loading = signal(false);

  createParty() {
    console.log('create party');
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 2000);
  }
}
