import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InputService {
  private manualValidation$ = new Subject<void>();
  manualValidationSource = this.manualValidation$.asObservable();

  triggerManualValidation() {
    this.manualValidation$.next();
  }
}
