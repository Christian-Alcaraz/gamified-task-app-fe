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
import { UserCharacter } from '@core/models';
import {
  BaseDialog,
  BaseDialogData,
  DialogActionsDirective,
  DialogContentDirective,
  DialogTitleDirective,
} from '@shared/components/dialog';
import { UserApiService } from '@shared/services/api/user/user.api.service';
import { UserStateService } from '@shared/services/state/user.state.service';

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
  ],
  templateUrl: './create-character-modal.component.html',
  styleUrl: './create-character-modal.component.scss',
})
export class CreateCharacterModalComponent extends BaseDialog<BaseDialogData> {
  private readonly _userApi = inject(UserApiService);
  private readonly userState = inject(UserStateService).userState();
  genders = ['male', 'female'];
  heroClasses = ['warrior', 'mage', 'archer', 'assassin'];

  selectedGender = signal(this.genders[0]);
  selectedClass = signal<string | null>(null);
  characterName = model<string>('');

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
  enableSubmit = computed(
    () =>
      this.isVerified() &&
      this.characterValue() &&
      this.selectedGender() &&
      this.selectedClass(),
  );

  verifyCharacterName() {
    this._userApi.isCharacterNameTaken(this.characterName()).subscribe({
      next: (isTaken) => {
        if (typeof isTaken === 'boolean') {
          this.isNameTaken.set(isTaken);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  submit() {
    const character: UserCharacter = {
      name: this.characterName(),
      gender: this.selectedGender() as 'male' | 'female',
      class: this.selectedClass() as string,
      imageUrl: this.classImage(
        this.selectedGender(),
        this.selectedClass() as string,
      )(),
    };

    if (this.userState?.flags?.hasCreatedCharacter) {
      this._updateUserCharacter(character);
    } else {
      this._patchCreateUserCharacter(character);
    }
  }

  private _patchCreateUserCharacter(character: UserCharacter) {
    this._userApi.patchCreateCharacter(character).subscribe({
      next: (user) => {
        this.closeDialog(user);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private _updateUserCharacter(character: UserCharacter) {
    this._userApi.updateUserCharacter(character).subscribe({
      next: (user) => {
        this.closeDialog(user);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
