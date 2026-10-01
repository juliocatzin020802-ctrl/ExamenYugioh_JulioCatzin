import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { YugiohService } from '../../services/yugioh.service';
import { ViewState } from '../../models/view-state.model';
import { YgoCard } from '../../models/card.model';
import { toViewState } from '../../utils/view-state.operator';
import { StatusMessageComponent } from '../status-message/status-message.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-blue-eyes',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusMessageComponent, CardComponent],
  templateUrl: './blue-eyes.component.html',
  styleUrl: './blue-eyes.component.css'
})
export class BlueEyesComponent {
  private readonly yugioh = inject(YugiohService);

  readonly retry$ = new Subject<void>();
  
  selectedCard = signal<YgoCard | null>(null);

  cards$: Observable<ViewState<YgoCard[]>> = this.retry$.pipe(
    startWith(undefined),
    switchMap(() => this.yugioh.getBlueEyesCards().pipe(toViewState<YgoCard[]>()))
  );

  onCardSelected(card: YgoCard): void {
    this.selectedCard.set(card);
  }

  onRetry(): void {
    this.retry$.next();
  }
}
