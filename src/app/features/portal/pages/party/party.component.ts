import { Component } from '@angular/core';

@Component({
  selector: 'app-party',
  imports: [],
  host: {
    '[class]': '"flex flex-col gap-4 w-full"',
  },
  templateUrl: './party.component.html',
  styleUrl: './party.component.scss',
})
export class PartyComponent {}
