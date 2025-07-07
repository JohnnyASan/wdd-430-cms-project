import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private baseUrl: string = 'http://localhost:3000/messages';

  private messages: Message[] = [];
  messagesChangedEvent = new Subject<Message[]>();

  addMessage(message: Message): void {
    if (!message) {
      return;
    }

    message.id = '';
    const headers = { 'Content-Type': 'application/json' };
    this.http
      .post<{ message: Message }>(this.baseUrl, message, {
        headers: headers,
      })
      .subscribe((response) => {
        this.messages.push(response.message);
        this.storeMessages();
      });
  }

  getMessages(): Message[] {
    this.http
      .get<{ message: String; messages: Message[] }>(this.baseUrl)
      .subscribe(
        ({ messages }) => {
          this.messages = messages;
          console.log('Fetched messages:', this.messages);
          this.messages.sort((a, b) => {
            return a.subject.localeCompare(b.subject);
          });
          this.messagesChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error('Error fetching messages:', error);
        }
      );
    console.log('Fetched messages:', this.messages);

    return this.messages.slice();
  }

  storeMessages() {
    let messages = JSON.stringify(this.messages);
    this.http
      .put(this.baseUrl, messages, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: () => {
          console.log('Messages stored successfully');
          this.messagesChangedEvent.next(this.messages.slice());
        },
        error: (error) => {
          console.error('Error storing messages:', error);
        },
      });
  }

  constructor(private http: HttpClient) {
    this.getMessages(); // Fetch messages on service initialization
  }
}
