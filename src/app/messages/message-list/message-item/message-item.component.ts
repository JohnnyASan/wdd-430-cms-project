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
  sender: Contact;
  constructor(private contactsService: ContactsService) {}
  ngOnInit() {
    this.sender = this.contactsService.getContactById(this.message.sender);
    this.contactsService.contactsListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.sender = contacts.find(
          (contact) => contact.id === this.message.sender
        );
      }
    );
  }
}
