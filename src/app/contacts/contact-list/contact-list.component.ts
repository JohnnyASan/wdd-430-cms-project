import { Component, EventEmitter, Output } from '@angular/core';
import { Contact } from '../../shared/contact.model';
import { ContactsService } from '../contacts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
})
export class ContactListComponent {
  contacts: Contact[] = [];
  term: string = '';
  clChanged: Subscription;
  isFetching: boolean = false;

  constructor(private contactsService: ContactsService) {}
  ngOnInit() {
    this.contactsService
      .getContacts()
      .subscribe((contacts) => (this.contacts = contacts));
    this.clChanged = this.contactsService.contactsListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
  }

  search(value: string): void {
    this.term = value;
  }

  ngOnDestroy() {
    this.clChanged.unsubscribe();
  }
}
