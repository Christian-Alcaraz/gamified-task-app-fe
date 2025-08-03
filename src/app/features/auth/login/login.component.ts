import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { TextFieldComponent } from '@shared/components/inputs/text-field/text-field.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TextFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends ThemeAwareComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  credentialForm!: FormGroup;

  constructor() {
    super();
    this.credentialForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    this.router.navigate(['portal']);
  }

  navigateToSignup() {
    this.router.navigate(['auth', 'sign-up']);
  }
}
