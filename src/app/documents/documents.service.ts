import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private documents: Document[] = [];
  private maxDocumentId: number;

  documentListChangedEvent = new Subject<Document[]>();
  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    this.documents.forEach((document) => {
      const currId = +document.id;
      if (currId > maxId) {
        maxId = currId;
      }
    });
    return maxId;
  }

  getDocuments(): Document[] {
    return this.documents.slice(); // Return a copy of the documents array
  }
  getDocument(id: string): Document | undefined {
    return this.getDocuments().find((document) => document.id === id);
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }
    document.id = (this.maxDocumentId++).toString();

    this.documents.push(document);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id; // Ensure the ID remains the same
    this.documents[pos] = newDocument;
    this.documentListChangedEvent.next(this.documents.slice());
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
