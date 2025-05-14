import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent {
  documents: Document[] = [
    new Document('1', 'Document 1', 'Description 1', 'http://example.com/doc1'),
    new Document('2', 'Document 2', 'Description 2', 'http://example.com/doc2'),
  ];
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  onDocumentSelected(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
