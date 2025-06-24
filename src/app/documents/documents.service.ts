import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private baseUrl: string =
    'https://ng-complete-guide-d6788-default-rtdb.europe-west1.firebasedatabase.app';
  public nextId: string;

  documentListChangedEvent = new Subject<Document[]>();
  constructor(private http: HttpClient) {
    this.getNextId();
    this.documentListChangedEvent.subscribe(() => this.getNextId());
  }

  private getNextId() {
    let maxId = 0;
    this.getDocuments().subscribe((res) => {
      let docs = Object.values(res);

      docs.forEach((doc) => {
        if (doc.id) {
          if (+doc.id > maxId) {
            maxId = +doc.id;
          }
        }
      });
      this.nextId = (++maxId).toString();
    });
    return (++maxId).toString();
  }

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}/documents.json`);
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }
    document.id = this.nextId;
    this.http
      .post<Document>(`${this.baseUrl}/documents.json`, document)
      .subscribe(() => {
        this.getDocuments().subscribe((documents) => {
          this.documentListChangedEvent.next(Object.values(documents));
        });
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    this.http
      .put<Document>(
        `${this.baseUrl}/documents/${originalDocument.id}.json`,
        newDocument
      )
      .subscribe((responseData) => {
        console.log(responseData);
        let docs = [];
        this.getDocuments().subscribe(
          (documents) => (docs = Object.values(documents))
        );
        this.documentListChangedEvent.next(docs);
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    this.http
      .delete(`${this.baseUrl}/documents/${document.id}.json`)
      .subscribe((responseData) => {
        console.log(responseData);
        let docs = [];
        this.getDocuments().subscribe(
          (documents) => (docs = Object.values(documents))
        );
        this.documentListChangedEvent.next(docs);
      });
  }
}
