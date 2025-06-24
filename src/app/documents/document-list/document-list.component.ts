import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';
import { DocumentsService } from '../documents.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent {
  documents: Document[] = [];
  private isFetching: boolean = false;
  private dlChanged: Subscription;
  constructor(private documentsService: DocumentsService) {}
  ngOnInit() {
    this.documentsService.getDocuments().subscribe((documents) => {
      this.documents = Object.values(documents);
    });
    this.dlChanged = this.documentsService.documentListChangedEvent.subscribe(
      (documents: Document[]) => {
        console.log(documents);
        this.documents = documents;
      }
    );
  }

  ngOnDestroy() {
    this.dlChanged.unsubscribe();
  }
}
