import { Component } from '@angular/core';
import { Contact } from '../../shared/contact.model';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css',
})
export class ContactListComponent {
  contacts: Contact[] = [
    new Contact(
      1,
      'John Doe',
      'email',
      '1234567890',
      'https://example.com/image.jpg'
    ),
    new Contact(
      2,
      'Jane Smith',
      'email',
      '0987654321',
      'https://example.com/image.jpg'
    ),
  ];
}
