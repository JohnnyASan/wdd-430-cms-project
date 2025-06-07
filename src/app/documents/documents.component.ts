import { Component } from '@angular/core';
import { DocumentsService } from './documents.service';

@Component({
  selector: 'cms-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent {
  constructor(private documentsService: DocumentsService) {

  }
}
