import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | undefined {
    return this.getContacts().find((contact) => contact.id === id);
  }
}
