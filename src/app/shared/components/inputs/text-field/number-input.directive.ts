import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberInput]',
})
export class NumberInputDirective {
  private el = inject(ElementRef<HTMLInputElement>);
  private ngControl = inject(NgControl, { optional: true });

  appNumberInputType = input.required<string>();

  private isTypeNumber(): boolean {
    return ['number', 'currency'].includes(
      this.appNumberInputType().toLowerCase(),
    );
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isTypeNumber()) {
      return;
    }

    const { key, ctrlKey, metaKey } = event;

    // Allowed: Backspace, Tab, Delete, Arrows, Home, End
    const isControlKey = [
      'Backspace',
      'Tab',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ].includes(key);

    // Allowed: Standard copy/paste commands (Ctrl/Meta + A/C/V/X)
    const isCommand =
      (ctrlKey || metaKey) && ['a', 'c', 'v', 'x'].includes(key.toLowerCase());

    // Allowed: Digits (0-9) from main keyboard or numpad
    const isDigit = /^\d$/.test(key);

    if (isControlKey || isCommand || isDigit) {
      return; // Allow the key press
    }

    // Block all other keys (including '.', '-', 'e', spaces, etc.)
    event.preventDefault();
  }

  @HostListener('input')
  onInputChange(): void {
    if (!this.isTypeNumber()) {
      return; // Do nothing if not in 'number' mode
    }

    const currentValue = this.el.nativeElement.value;
    let newValue = currentValue;

    // Logic remains the same (enforce non-negative and filter non-digits)
    try {
      if (parseFloat(currentValue) < 0) {
        newValue = '0';
      }
      newValue = newValue.replace(/[^0-9]/g, '');
    } catch {
      newValue = '0';
    }

    this.el.nativeElement.value = newValue;

    if (this.ngControl) {
      this.ngControl.control?.setValue(newValue, { emitEvent: false });
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    if (!this.isTypeNumber()) {
      return; // Do nothing if not in 'number' mode
    }

    event.preventDefault(); // Stop the default browser paste action
    const pasteData = event.clipboardData?.getData('text/plain') || '';
    const cleanData = pasteData.replace(/[^0-9]/g, '');

    if (pasteData !== cleanData) {
      return;
    }
    document.execCommand('insertText', false, cleanData);

    this.onInputChange();
  }
}
