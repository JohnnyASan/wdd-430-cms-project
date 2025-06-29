import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private baseUrl: string =
    'https://ng-complete-guide-d6788-default-rtdb.europe-west1.firebasedatabase.app';
  private messages: Message[];
  messagesChangedEvent = new EventEmitter<Message[]>();
  addMessage(message: Message): void {
    this.messages.push(message);
    this.messagesChangedEvent.emit(this.getMessages());
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }
  getMessage(id: string): Message | undefined {
    return this.getMessages().find((message) => message.id === id);
  }

  constructor() {
    this.messages = MOCKMESSAGES;
  }
}
