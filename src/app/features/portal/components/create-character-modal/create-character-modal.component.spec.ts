import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCharacterModalComponent } from './create-character-modal.component';

describe('CreateCharacterModalComponent', () => {
  let component: CreateCharacterModalComponent;
  let fixture: ComponentFixture<CreateCharacterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCharacterModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCharacterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
