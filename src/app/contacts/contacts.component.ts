import { Component } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { ContactsService } from './contacts.service';

@Component({
  selector: 'cms-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent {
  selectedContact: Contact;

  constructor(private contactsService: ContactsService) {}
  ngOnInit() {
    this.contactsService.contactSelectedEvent.subscribe((contact: Contact) => {
      this.selectedContact = contact;
    });
  }
}
