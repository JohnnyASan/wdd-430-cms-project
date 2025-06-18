import { Component, OnInit } from '@angular/core';
import { Contact } from '../../shared/contact.model';
import { ContactsService } from '../contacts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  editMode: boolean = false;
  groupContacts: Contact[] = [];
  id: string;

  constructor(
    private contactsService: ContactsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.originalContact = this.contactsService.getContactById(
          params['id']
        );
        if (!this.originalContact) return;
        this.editMode = true;
        this.contact = Object.create(this.originalContact); // Create a copy of the original contact
        if (this.contact.group) {
          this.groupContacts = this.contact.group.slice();
        }
      } else this.editMode = false;
    });
  }

  onSubmit(form: NgForm) {
    if (this.editMode) {
      let updatedContact = form.value;
      updatedContact.group = this.groupContacts.slice();
      this.contactsService.updateContact(this.originalContact, updatedContact);
    } else {
      this.contact = new Contact(
        '',
        form.value.name,
        form.value.email,
        form.value.phone,
        form.value.imageUrl,
        form.value.children
      );
      this.contactsService.addContact(this.contact);
    }
    this.router.navigate(['/contacts']);
  }
  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onRemoveGroupContact(id: number) {
    this.groupContacts = this.groupContacts.filter(
      (c) => c.id !== id.toString()
    );
    if (this.groupContacts.length < 1) {
      this.contact.group = null;
    } else {
      this.contact.group = this.groupContacts.slice();
    }
  }
}
