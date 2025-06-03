import { Component } from '@angular/core';
import { ContactsService } from './contacts.service';

@Component({
  selector: 'cms-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent {
  constructor(private contactsService: ContactsService) {}
  ngOnInit() {}
}
