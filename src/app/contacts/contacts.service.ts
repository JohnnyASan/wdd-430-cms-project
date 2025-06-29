import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private baseUrl: string =
    'https://ng-complete-guide-d6788-default-rtdb.europe-west1.firebasedatabase.app';
  private contacts: Contact[] = [];
  private maxContactId: number;
  contactsListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {
    this.getContacts(); // Fetch contacts on service initialization
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
    this.http.get<Contact[]>(this.baseUrl + '/contacts.json').subscribe(
      (contacts) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        this.contactsListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
      }
    );

    return this.contacts.slice();
  }

  getContact(index: number): Contact | undefined {
    return this.getContacts()[index];
  }

  getContactById(id: string): Contact | undefined {
    return this.getContacts().find((contact) => contact.id === id);
  }

  storeContacts() {
    let contacts = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(this.baseUrl + '/contacts.json', contacts, { headers: headers })
      .subscribe({
        next: (response) => {
          console.log('Contacts stored successfully:', response);
          this.contactsListChangedEvent.next(this.contacts.slice());
        },
        error: (error) => {
          console.error('Error storing contacts:', error);
        },
      });
  }

  addContact(contact: Contact): void {
    if (!contact) {
      return;
    }
    let maxId = this.getMaxId();
    contact.id = (++maxId).toString();
    this.contacts.push(contact);
    this.storeContacts();
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
    this.storeContacts();
  }

  deleteContact(id: number): void {
    if (id < 0) {
      return;
    }
    this.contacts = this.contacts.filter(
      (contact) => contact.id !== id.toString()
    );
    this.storeContacts();
  }
}
