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
  term: string = '';

  constructor(private contactsService: ContactsService) {}
  ngOnInit() {
    this.contactsService
      .getContacts()
      .subscribe((contacts) => (this.contacts = Object.values(contacts)));
    this.contactsService.contactsListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
  }

  search(value: string): void {
    this.term = value;
  }
}
