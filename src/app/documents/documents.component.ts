import { Component } from '@angular/core';
import { DocumentsService } from './documents.service';

@Component({
  selector: 'cms-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent {
  selectedDocument: Document | undefined = null;
  constructor(private documentsService: DocumentsService) {
    this.documentsService.documentSelectedEvent.subscribe(
      (document: Document) => {
        this.selectedDocument = document;
      }
    );
  }
}
