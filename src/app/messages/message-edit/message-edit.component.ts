import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css',
})
export class MessageEditComponent {
  @Output() messageSent = new EventEmitter<Message>();
  @ViewChild('subjectInput') subjectInput: ElementRef;
  @ViewChild('msgInput') msgInput: ElementRef;
  currentSender: string = '1';

  onSend() {
    const subject = this.subjectInput.nativeElement.value;
    const msg = this.msgInput.nativeElement.value;
    const message = new Message(
      Math.random().toString(),
      subject,
      msg,
      this.currentSender
    );
    this.messageSent.emit(message);
  }
  onClear() {
    this.subjectInput.nativeElement.value = '';
    this.msgInput.nativeElement.value = '';
  }
}
