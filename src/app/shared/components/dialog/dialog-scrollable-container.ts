import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dialog-scrollable-container',
  imports: [CdkPortalOutlet, CdkScrollable],
  template: `
    <div
      class="max-h-[100%] overflow-y-auto white-styled-scrollbars p-1"
      cdkScrollable
    >
      <ng-template cdkPortalOutlet></ng-template>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DialogScrollableContainer extends CdkDialogContainer {}
