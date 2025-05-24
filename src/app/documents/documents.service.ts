import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private documents: Document[] = [];
  documentSelectedEvent = new EventEmitter<Document>();

  getDocuments(): Document[] {
    return this.documents.slice(); // Return a copy of the documents array
  }
  getDocument(id: string): Document | undefined {
    return this.getDocuments().find((document) => document.id === id);
  }

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }
}
