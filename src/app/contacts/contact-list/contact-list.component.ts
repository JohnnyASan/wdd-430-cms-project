import { Component, EventEmitter, Output } from '@angular/core';
import { Contact } from '../../shared/contact.model';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
})
export class ContactListComponent {
  contacts: Contact[] = [];

  constructor(private contactsService: ContactsService) {}
  ngOnInit() {
    this.contacts = this.contactsService.getContacts();
  }

  onContactClicked(contact: Contact) {
    this.contactsService.contactSelectedEvent.emit(contact);
  }
}
