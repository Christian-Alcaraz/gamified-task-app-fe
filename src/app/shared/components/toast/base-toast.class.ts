import { computed, Directive } from '@angular/core';
import { NgpToast } from 'ng-primitives/toast';

@Directive({
  host: {
    '[class]': 'hostCss()',
  },
  hostDirectives: [NgpToast],
})
export class BaseToast {
  protected hostCss = computed(() => {
    return '';
  });
}
