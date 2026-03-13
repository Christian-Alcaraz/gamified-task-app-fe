import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChatViewComponent } from './components/chat-view/chat-view.component';
import { MissionProgressComponent } from './components/mission-progress/mission-progress.component';

@Component({
  selector: 'app-party',
  imports: [CommonModule, ChatViewComponent, MissionProgressComponent],
  templateUrl: './party.component.html',
  styleUrl: './party.component.scss',
})
export class PartyComponent {}
