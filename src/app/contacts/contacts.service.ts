import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private baseUrl: string =
    'https://ng-complete-guide-d6788-default-rtdb.europe-west1.firebasedatabase.app';
  public nextId: string;
  contactsListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {
    this.getNextId();
    this.contactsListChangedEvent.subscribe(() => this.getNextId());
  }

  private getNextId() {
    let maxId = 0;
    this.getContacts().subscribe((res) => {
      let contacts = Object.values(res);

      contacts.forEach((con) => {
        if (con.id) {
          if (+con.id > maxId) {
            maxId = +con.id;
          }
        }
      });
      this.nextId = (++maxId).toString();
    });
    return (++maxId).toString();
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.baseUrl}/contacts.json`);
  }

  addContact(contact: Contact): void {
    if (!contact) {
      return;
    }
    contact.id = this.nextId;
    this.http
      .post<Contact>(`${this.baseUrl}/contacts.json`, contact)
      .subscribe(() => {
        this.getContacts().subscribe((contacts) => {
          this.contactsListChangedEvent.next(Object.values(contacts));
        });
      });
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }
    this.http
      .put<Contact>(
        `${this.baseUrl}/contacts/${originalContact.id}.json`,
        newContact
      )
      .subscribe((responseData) => {
        console.log(responseData);
        let docs = [];
        this.getContacts().subscribe(
          (contacts) => (docs = Object.values(contacts))
        );
        this.contactsListChangedEvent.next(docs);
      });
  }

  deleteContact(id: number): void {
    if (id < 0) {
      return;
    }
    this.http
      .delete(`${this.baseUrl}/contacts/${id}.json`)
      .subscribe((responseData) => {
        console.log(responseData);
        let docs = [];
        this.getContacts().subscribe(
          (contacts) => (docs = Object.values(contacts))
        );
        this.contactsListChangedEvent.next(docs);
      });
  }
}
