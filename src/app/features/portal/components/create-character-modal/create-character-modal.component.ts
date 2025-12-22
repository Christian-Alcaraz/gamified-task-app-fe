import { CommonModule, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  linkedSignal,
  model,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UI_STATE } from '@core/constants';
import { IUserCharacter, User } from '@core/models';
import { NgIcon } from '@ng-icons/core';
import {
  BaseDialog,
  DialogActionsDirective,
  DialogContentDirective,
  DialogTitleDirective,
  IBaseDialogData,
} from '@shared/components/dialog';
import { ToastService } from '@shared/components/toast/toast.service';
import { UserApiService } from '@shared/services/api/user/user.api.service';
import { UserStateService } from '@shared/services/state/user.state.service';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-create-character-modal',
  imports: [
    CommonModule,
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective,
    NgOptimizedImage,
    TitleCasePipe,
    FormsModule,
    NgIcon,
  ],
  templateUrl: './create-character-modal.component.html',
  styleUrl: './create-character-modal.component.scss',
})
export class CreateCharacterModalComponent extends BaseDialog<IBaseDialogData> {
  private readonly _userApi = inject(UserApiService);
  private readonly userState = inject(UserStateService).userState();
  private readonly toast = inject(ToastService);

  genders = ['male', 'female'];
  heroClasses = ['warrior', 'mage', 'archer', 'assassin'];

  selectedGender = signal(this.genders[0]);
  selectedClass = signal<string | null>(null);
  characterName = model<string>('');
  loading = signal(false);

  isNameTaken = signal<boolean | null>(null);
  isVerified = linkedSignal({
    source: () => ({
      name: this.characterName(),
      taken: this.isNameTaken(),
    }),
    computation: ({ name, taken }, previous) => {
      if (name !== previous?.source.name) {
        untracked(() => this.isNameTaken.set(null));
        return false;
      }
      return taken === false && name === previous?.source.name;
    },
  });

  classImage = (gender: string, heroClass: string) =>
    computed(() => `images/${gender}_${heroClass}.png`);

  characterValue = computed(() => !!this.characterName());
  canSubmit = computed(
    () =>
      this.isVerified() &&
      this.characterValue() &&
      this.selectedGender() &&
      this.selectedClass() &&
      !this.loading(),
  );

  verifyCharacterName() {
    this._userApi.isCharacterNameTaken(this.characterName()).subscribe({
      next: (isTaken) => {
        if (typeof isTaken !== 'boolean') {
          console.error(
            'Something really went wrong, this api should return a boolean',
          );
          this.toast.showToast(
            'Error',
            'Something went really wrong. Check console',
            UI_STATE.Error,
          );
          return;
        }
        const header = isTaken ? 'Name Taken' : 'Name Available';
        const message = isTaken
          ? 'Character name is already taken.'
          : 'Character name is available.';
        const type = isTaken ? UI_STATE.Warning : UI_STATE.Success;
        this.toast.showToast(header, message, type);
        this.isNameTaken.set(isTaken);
      },
      error: ({ error }) => {
        console.error(error.message);
      },
    });
  }

  submit() {
    const character: IUserCharacter = {
      name: this.characterName(),
      gender: this.selectedGender() as 'male' | 'female',
      class: this.selectedClass() as string,
      imageUrl: this.classImage(
        this.selectedGender(),
        this.selectedClass() as string,
      )(),
    };

    const hasCreatedCharacter = this.userState?.flags?.hasCreatedCharacter;
    const apiService = hasCreatedCharacter
      ? this._updateUserCharacter(character)
      : this._patchCreateUserCharacter(character);

    this.loading.update(() => true);
    apiService
      .pipe(finalize(() => this.loading.update(() => false)))
      .subscribe({
        next: (user) => {
          this.loading.update(() => false);
          const header = hasCreatedCharacter
            ? 'Character Updated'
            : 'Character Created';
          const message = hasCreatedCharacter
            ? 'Character has been updated.'
            : 'Character has been created.';
          this.toast.showToast(header, message, UI_STATE.Success);
          this.closeDialog(user);
        },
        error: ({ error }) => {
          this.toast.showToast('Error', error.message, UI_STATE.Error);
        },
      });
  }

  private _patchCreateUserCharacter(
    character: IUserCharacter,
  ): Observable<User> {
    return this._userApi.patchCreateCharacter(character);
  }

  private _updateUserCharacter(character: IUserCharacter): Observable<User> {
    return this._userApi.updateUserCharacter(character);
  }
}
