import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeAwareComponent } from '@core/classes/theme-aware-component.class';
import { Token, UIState } from '@core/constants';
import { PasswordFieldComponent } from '@shared/components/inputs';
import { TextFieldComponent } from '@shared/components/inputs/text-field/text-field.component';
import { ToastService } from '@shared/components/toast/toast.service';
import { ApiService } from '@shared/services/api';
import { UserStateService } from '@shared/services/state/user.state.service';
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
  private readonly toast = inject(ToastService);
  private readonly _userStateService = inject(UserStateService);
  private readonly enviroment = environment.ENVIRONMENT_NAME;
  private readonly email = environment.EMAIL;
  private readonly password = environment.PASSWORD;

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

    this.credentialForm = this._formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]],
      password: [this.password, [Validators.required]],
    });

    if (this.enviroment !== 'production') {
      this.credentialForm.markAllAsDirty();
    }
  }

  submit() {
    const { email, password } = this.credentialForm.getRawValue();

    this._authApi.login(email, password).subscribe({
      next: (user) => {
        localStorage.setItem(Token.Auth, user.token);
        this.toast.showToast('Welcome!', 'Login Successful', UIState.Success);
        this._userStateService.setUserState(user);
        this._router.navigate(['hub']);
      },
      error: ({ error }) => {
        this.toast.showToast('Error', error.message, UIState.Error);
      },
    });
  }

  navigateToSignup() {
    this._router.navigate(['auth', 'sign-up']);
  }
}
