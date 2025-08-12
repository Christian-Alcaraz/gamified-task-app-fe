import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalScrollCoordinatorService {
  private isDatePickerOpenSubject = new BehaviorSubject<boolean>(false);
  private scrollEventSubject = new Subject<Event>();

  isDatePickerOpen$ = this.isDatePickerOpenSubject.asObservable();
  scrollEvent$ = this.scrollEventSubject.asObservable();

  setDatePickerOpen(isOpen: boolean): void {
    this.isDatePickerOpenSubject.next(isOpen);
  }

  emitScrollEvent(event: Event): void {
    this.scrollEventSubject.next(event);
  }

  get isDatePickerOpen(): boolean {
    return this.isDatePickerOpenSubject.value;
  }
}
