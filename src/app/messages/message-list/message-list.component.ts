import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Message 1', 'This is the first message.', 'User A'),
    new Message('2', 'Message 2', 'This is the second message.', 'User B'),
    new Message('3', 'Message 3', 'This is the third message.', 'User C'),
    new Message('4', 'Message 4', 'This is the fourth message.', 'User D'),
    new Message('5', 'Message 5', 'This is the fifth message.', 'User E'),
    new Message('6', 'Message 6', 'This is the sixth message.', 'User F'),
  ];

  onMessageSent(message: Message) {
    this.messages.push(message);
  }
}
