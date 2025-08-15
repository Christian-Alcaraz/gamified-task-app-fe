import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { PasswordFieldComponent } from '@shared/components/inputs';
import { TextFieldComponent } from '@shared/components/inputs/text-field/text-field.component';
@Component({
  selector: 'app-sign-up',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PasswordFieldComponent,
    TextFieldComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent extends ThemeAwareComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  credentialForm!: FormGroup;

  passwordPropsValidators = {
    required: true,
    atleastHasOneUppercase: true,
    atleastHasOneLowercase: true,
    atleastHasOneNumeric: true,
    minlength: 8,
  };

  confirmPasswordPropsValidators = {
    required: true,
    mustMatchWithControl: 'password',
  };

  constructor() {
    super();
    this.credentialForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
    });
  }

  submit() {
    //Todo: attach api service
    this._router.navigate(['hub']);
  }

  navigateToLogin() {
    this._router.navigate(['auth', 'login']);
  }
}
