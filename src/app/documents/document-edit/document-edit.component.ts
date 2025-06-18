import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'cms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css',
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentsService: DocumentsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        let id = params['id'];

        this.originalDocument = this.documentsService.getDocument(id);
        if (!this.originalDocument) return;
        this.editMode = true;
        this.document = Object.create(this.originalDocument); // Create a copy of the original document
      } else {
        this.editMode = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (this.editMode) {
      this.document = form.value;
      this.documentsService.updateDocument(
        this.originalDocument,
        this.document
      );
    } else {
      this.document = new Document(
        '',
        form.value.name,
        form.value.description,
        form.value.url,
        form.value.children
      );
      this.documentsService.addDocument(this.document);
    }
    this.router.navigate(['/documents']);
  }
  onCancel() {
    this.router.navigate(['/documents']);
  }
}
