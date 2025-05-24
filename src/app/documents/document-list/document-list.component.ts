import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent {
  documents: Document[] = [];
  constructor(private documentsService: DocumentsService) {}
  ngOnInit() {
    this.documents = this.documentsService.getDocuments();
  }
  onDocumentSelected(document: Document) {
    this.documentsService.documentSelectedEvent.emit(document);
  }
}
