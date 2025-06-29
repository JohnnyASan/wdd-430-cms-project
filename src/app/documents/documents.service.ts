import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private documents: Document[] = [];
  private baseUrl: string =
    'https://ng-complete-guide-d6788-default-rtdb.europe-west1.firebasedatabase.app';
  public nextId: string;

  documentListChangedEvent = new Subject<Document[]>();
  constructor(private http: HttpClient) {
    this.getDocumentsFromDatabase().subscribe((documents) => {
      this.documents = documents;
    });
    this.getNextId();
  }

  private getNextId() {
    let maxId = 0;
    this.documents.forEach((document) => {
      const id = parseInt(document.id, 10);
      if (id > maxId) {
        maxId = id;
      }
    });
    // Increment maxId to get the next available ID
    return (++maxId).toString();
  }
  getDocuments(): Document[] {
    this.getDocumentsFromDatabase().subscribe((documents) => {
      this.documents = documents;
    });
    return this.documents.slice();
  }

  getDocumentsFromDatabase(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}/documents.json`);
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }
    document.id = this.nextId;

    this.documents.push(document);

    this.http
      .post<Document>(`${this.baseUrl}/documents.json`, document)
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const index = this.documents.indexOf(originalDocument);
    this.documents[index] = newDocument;

    this.http
      .put<Document[]>(`${this.baseUrl}/documents`, this.documents)
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const index = this.documents.indexOf(document);
    if (index < 0) {
      return;
    }
    this.documents.splice(index, 1);

    this.http
      .put<Document[]>(`${this.baseUrl}/documents/`, this.documents)
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }
}
