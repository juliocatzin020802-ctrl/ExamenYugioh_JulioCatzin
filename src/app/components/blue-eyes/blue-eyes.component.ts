import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, Subject, combineLatest, of } from 'rxjs';
import { switchMap, startWith, map, shareReplay, catchError } from 'rxjs/operators';
import { YugiohService } from '../../services/yugioh.service';
import { ViewState } from '../../models/view-state.model';
import { YgoCard } from '../../models/card.model';
import { toViewState } from '../../utils/view-state.operator';
import { StatusMessageComponent } from '../status-message/status-message.component';
import { CardComponent } from '../card/card.component';
import { ExpansionFilterComponent } from '../expansion-filter/expansion-filter.component';
import { CardPrintsComponent } from '../card-prints/card-prints.component';
import { extractExpansions, filterByExpansion } from '../../utils/expansions.util';

@Component({
  selector: 'app-blue-eyes',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusMessageComponent, CardComponent, ExpansionFilterComponent, CardPrintsComponent],
  templateUrl: './blue-eyes.component.html',
  styleUrl: './blue-eyes.component.css'
})
export class BlueEyesComponent {
  private readonly yugioh = inject(YugiohService);

  readonly retry$ = new Subject<void>();
  
  selectedCard = signal<YgoCard | null>(null);

  private readonly cardsState$ = this.retry$.pipe(
    startWith(undefined),
    switchMap(() => this.yugioh.getBlueEyesCards().pipe(toViewState<YgoCard[]>())),
    shareReplay(1)
  );

  expansions$: Observable<string[]> = this.cardsState$.pipe(
    map(state => state.status === 'success' ? extractExpansions(state.data) : [])
  );

  selectedExpansion$ = new BehaviorSubject<string | null>(null);

  vm$: Observable<ViewState<YgoCard[]>> = combineLatest([
    this.cardsState$, 
    this.selectedExpansion$
  ]).pipe(
    map(([state, exp]) => {
      if (state.status !== 'success') {
        return state;
      }
      
      const filtered = filterByExpansion(state.data, exp);
      
      setTimeout(() => {
        const latestSelection = this.selectedCard();
        if (latestSelection && !filtered.some(c => c.id === latestSelection.id)) {
          this.selectedCard.set(null);
        }
      });

      if (filtered.length === 0) {
        return { status: 'empty' as const };
      }

      return { status: 'success' as const, data: filtered };
    })
  );

  onCardSelected(card: YgoCard): void {
    this.selectedCard.set(card);
  }

  onRetry(): void {
    this.retry$.next();
  }

  onExpansionChange(exp: string | null): void {
    this.selectedExpansion$.next(exp);
  }
}
