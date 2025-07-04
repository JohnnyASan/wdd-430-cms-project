import { Component, Input } from '@angular/core';
import { Message } from '../../message.model';
import { Contact } from '../../../shared/contact.model';
import { ContactsService } from '../../../contacts/contacts.service';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css',
})
export class MessageItemComponent {
  @Input() message: Message;
  constructor(private contactsService: ContactsService) {}
  get sender(): Contact {
    return this.contactsService.getContactById(this.message.sender);
  }
}
