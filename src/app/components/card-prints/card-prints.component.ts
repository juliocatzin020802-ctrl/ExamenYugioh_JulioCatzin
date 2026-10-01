import { Component, Input } from '@angular/core';
import { CardSet } from '../../models/card.model';

@Component({
  selector: 'app-card-prints',
  standalone: true,
  imports: [],
  templateUrl: './card-prints.component.html',
  styleUrl: './card-prints.component.css'
})
export class CardPrintsComponent {
  @Input() sets: CardSet[] | undefined;
  @Input() highlightSet: string | null = null;
}
