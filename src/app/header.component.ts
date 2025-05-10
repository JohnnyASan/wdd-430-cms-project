import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  @Output() featureSelected = new EventEmitter<string>();
  onNavSelect(feature: string) {
    this.featureSelected.emit(feature);
  }
}
