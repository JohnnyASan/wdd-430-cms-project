import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Observable, Subject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private baseUrl: string = 'http://localhost:3000/contacts';

  private contacts: Contact[] = [];
  contactsListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {
    this.getContacts(); // Fetch contacts on service initialization
  }

  getContacts(): Contact[] {
    this.http
      .get<{ message: String; contacts: Contact[] }>(this.baseUrl)
      .subscribe(
        ({ contacts }) => {
          this.contacts = contacts;
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
    this.http.put(this.baseUrl, contacts, { headers: headers }).subscribe({
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

    contact.id = ''; // Ensure the ID is empty for new contacts
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: String; contact: Contact }>(this.baseUrl, contact, {
        headers: headers,
      })
      .subscribe((response) => {
        this.contacts.push(response.contact);
        this.storeContacts();
      });
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.findIndex(
      (contact) => contact.id === originalContact.id
    );
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id; // Ensure the ID remains the same
    newContact._id = originalContact._id; // Ensure the MongoDB ID remains the same
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put<{ message: String; contact: Contact }>(
        `${this.baseUrl}/${originalContact.id}`,
        newContact,
        {
          headers: headers,
        }
      )
      .subscribe((response) => {
        this.contacts[pos] = newContact;
        this.storeContacts();
      });
  }

  deleteContact(id: number): void {
    if (id < 0) {
      return;
    }
    const pos = this.contacts.findIndex(
      (contact) => contact.id === id.toString()
    );
    if (pos < 0) {
      return;
    }
    this.http.delete(`${this.baseUrl}/${id}`).subscribe((response) => {
      this.contacts.splice(pos, 1);
      this.storeContacts();
    });
  }
}
