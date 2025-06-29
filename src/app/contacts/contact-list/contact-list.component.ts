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
  term: string = '';
  contacts: Contact[] = [];

  constructor(private contactsService: ContactsService) {}
  ngOnInit() {
    this.contacts = this.contactsService.getContacts();
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
