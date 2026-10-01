import { Component, Input, Output, EventEmitter } from '@angular/core';
import { YgoCard } from '../../models/card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input({ required: true }) card!: YgoCard;
  @Output() cardSelected = new EventEmitter<YgoCard>();

  onSelect(): void {
    this.cardSelected.emit(this.card);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSelect();
    }
  }

  hasValue(val: number | undefined | null): boolean {
    return val !== undefined && val !== null;
  }
}
