import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private baseUrl: string =
    'https://ng-complete-guide-d6788-default-rtdb.europe-west1.firebasedatabase.app';
  private messages: Message[];
  private maxMessageId: number;
  messagesChangedEvent = new EventEmitter<Message[]>();

  getMaxId(): number {
    let maxId = 0;
    this.messages.forEach((message) => {
      const currId = +message.id;
      if (currId > maxId) {
        maxId = currId;
      }
    });
    return maxId;
  }
  addMessage(message: Message): void {
    if (!message) {
      return;
    }
    if (!message.id) {
      message.id = (++this.maxMessageId).toString();
    }

    this.messages.push(message);
    this.storeMessages();
  }

  getMessages(): Message[] {
    this.http.get<Message[]>(this.baseUrl + '/messages.json').subscribe(
      (messages) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort((a, b) => {
          return a.subject.localeCompare(b.subject);
        });
        this.messagesChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error fetching messages:', error);
      }
    );
    return this.messages.slice();
  }
  getMessage(id: string): Message | undefined {
    return this.getMessages().find((message) => message.id === id);
  }

  storeMessages() {
    let messages = JSON.stringify(this.messages);
    this.http
      .put(this.baseUrl + '/messages.json', messages, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: () => {
          console.log('Messages stored successfully');
          this.messagesChangedEvent.emit(this.messages.slice());
        },
        error: (error) => {
          console.error('Error storing messages:', error);
        },
      });
  }

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId();
  }
}
