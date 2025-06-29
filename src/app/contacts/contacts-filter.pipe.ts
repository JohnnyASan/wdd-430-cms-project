import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from '../shared/contact.model';

@Pipe({
  name: 'contactsFilter',
  standalone: false,
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): Contact[] {
    if (!term || term.length === 0) return contacts;
    const filtered = contacts.filter((c) =>
      c.name.toLowerCase().includes(term.toLowerCase())
    );
    return filtered.length > 0 ? filtered : contacts;
  }
}
