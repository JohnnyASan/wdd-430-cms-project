import { Component, Input } from '@angular/core';
import { Contact } from '../../../shared/contact.model';

@Component({
  selector: 'cms-contact-item',
  standalone: false,
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css',
})
export class ContactItemComponent {
  @Input() contact: Contact;
}
