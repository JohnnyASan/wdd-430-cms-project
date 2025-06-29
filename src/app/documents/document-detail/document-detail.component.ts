import { Component, Input } from '@angular/core';
import { Document } from '../document.model';
import { ActivatedRoute, Params } from '@angular/router';
import { DocumentsService } from '../documents.service';
import { WinRefService } from '../../win-ref.service';

@Component({
  selector: 'cms-document-detail',
  standalone: false,
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css',
})
export class DocumentDetailComponent {
  document: Document;
  id: string;
  nativeWindow: any;

  constructor(
    private documentsService: DocumentsService,
    private route: ActivatedRoute,
    private winRefService: WinRefService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.document = this.documentsService
        .getDocuments()
        .find((doc) => doc.id === this.id);
    });
    this.nativeWindow = this.winRefService.getNativeWindow();
  }

  onView() {
    if (this.document) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    if (this.document) {
      this.documentsService.deleteDocument(this.document);
      this.nativeWindow.history.back();
    }
  }
}
