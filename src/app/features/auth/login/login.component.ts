import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { Token } from '@core/constants';
import { PasswordFieldComponent } from '@shared/components/inputs';
import { TextFieldComponent } from '@shared/components/inputs/text-field/text-field.component';
import { ApiService } from '@shared/services/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TextFieldComponent, PasswordFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends ThemeAwareComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authApi = inject(ApiService).auth;
  private readonly _env = environment.ENVIRONMENT_NAME;

  credentialForm!: FormGroup;

  emailPropsValidators = {
    required: true,
    email: true,
  };

  passwordPropsValidators = {
    required: true,
  };

  constructor() {
    super();
    const isProd = this._env === 'production';
    const email = isProd ? '' : 'gamified@taskapp.com';
    const password = isProd ? '' : 'Password123!';

    this.credentialForm = this._formBuilder.group({
      email: [email, [Validators.required, Validators.email]],
      password: [password, [Validators.required]],
    });

    if (!isProd) {
      this.credentialForm.markAllAsDirty();
    }
  }

  submit() {
    const { email, password } = this.credentialForm.getRawValue();

    this._authApi.login(email, password).subscribe({
      next: (user) => {
        localStorage.setItem(Token.Auth, user.token);
        this._router.navigate(['hub']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  navigateToSignup() {
    this._router.navigate(['auth', 'sign-up']);
  }
}
