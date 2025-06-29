import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private baseUrl: string =
    'https://ng-complete-guide-d6788-default-rtdb.europe-west1.firebasedatabase.app';
  private documents: Document[] = [];
  private maxDocumentId: number;

  documentListChangedEvent = new Subject<Document[]>();
  constructor(private http: HttpClient) {
    this.getDocuments(); // Fetch documents on service initialization
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
    this.http.get<Document[]>(this.baseUrl + '/documents.json').subscribe(
      (documents) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.error('Error fetching documents:', error);
      }
    );

    return this.documents.slice();
  }
  getDocument(id: string): Document | undefined {
    return this.getDocuments().find((document) => document.id === id);
  }

  storeDocuments() {
    let documents = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(this.baseUrl + '/documents.json', documents, { headers: headers })
      .subscribe({
        next: (response) => {
          console.log('Documents stored successfully:', response);
          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (error) => {
          console.error('Error storing documents:', error);
        },
      });
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }
    let maxId = this.getMaxId();
    document.id = (++maxId).toString();

    this.documents.push(document);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.findIndex(
      (doc) => doc.id === originalDocument.id
    );
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id; // Ensure the ID remains the same
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.findIndex((doc) => doc.id === document.id);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
