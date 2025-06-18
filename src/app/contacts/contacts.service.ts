import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts: Contact[] = [];
  private maxContactId: number;
  contactsListChangedEvent = new Subject<Contact[]>();

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    this.contacts.forEach((contact) => {
      const currId = +contact.id;
      if (currId > maxId) {
        maxId = currId;
      }
    });
    return maxId;
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

  addContact(contact: Contact): void {
    if (!contact) {
      return;
    }
    let maxId = this.getMaxId();
    contact.id = (++maxId).toString();
    this.contacts.push(contact);
    this.contactsListChangedEvent.next(this.contacts.slice());
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id; // Ensure the ID remains the same
    this.contacts[pos] = newContact;
    this.contactsListChangedEvent.next(this.contacts.slice());
  }

  deleteContact(id: number): void {
    if (id < 0) {
      return;
    }
    this.contacts = this.contacts.filter(
      (contact) => contact.id !== id.toString()
    );
    this.contactsListChangedEvent.next(this.contacts.slice());
  }
}
