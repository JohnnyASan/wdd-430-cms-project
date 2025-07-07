import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private baseUrl: string = 'http://localhost:3000/documents';
  private documents: Document[] = [];

  documentListChangedEvent = new Subject<Document[]>();
  constructor(private http: HttpClient) {
    this.getDocuments(); // Fetch documents on service initialization
  }

  getDocuments(): Document[] {
    this.http
      .get<{ message: String; documents: Document[] }>(this.baseUrl)
      .subscribe(
        ({ documents }) => {
          this.documents = documents;
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
    this.http.put(this.baseUrl, documents, { headers: headers }).subscribe({
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

    document.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: String; document: Document }>(this.baseUrl, document, {
        headers: headers,
      })
      .subscribe((response) => {
        this.documents.push(response.document);
        this.storeDocuments();
      });
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
    newDocument._id = originalDocument._id; // Ensure the MongoDB ID remains the same

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(this.baseUrl + '/' + originalDocument.id, newDocument, {
        headers: headers,
      })
      .subscribe((response: Response) => {
        this.documents[pos] = newDocument; // Update the document in the array
        this.storeDocuments(); // Store the updated documents
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.findIndex((doc) => doc.id === document.id);
    if (pos < 0) {
      return;
    }
    this.http
      .delete(this.baseUrl + '/' + document.id)
      .subscribe((response: Response) => {
        this.documents.splice(pos, 1);
        this.storeDocuments();
      });
  }
}
