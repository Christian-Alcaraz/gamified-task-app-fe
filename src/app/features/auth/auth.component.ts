import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent extends ThemeAwareComponent {}
