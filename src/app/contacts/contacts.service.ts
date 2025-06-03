import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts: Contact[] = [];
  contactSelectedEvent = new EventEmitter<Contact>();
  contactsChangedEvent = new EventEmitter<Contact[]>();

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }
  getContact(index: number): Contact | undefined {
    return this.getContacts()[index];
  }

  getContactById(id: string): Contact | undefined {
    return this.getContacts().find((contact) => contact.id === id);
  }

  deleteContact(index: number): void {
    if (index < 0 || index >= this.contacts.length) {
      return;
    }
    this.contacts.splice(index, 1);
    this.contactsChangedEvent.emit(this.contacts.slice());
  }
}
