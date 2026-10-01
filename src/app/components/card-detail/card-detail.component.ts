import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, merge, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { YugiohService } from '../../services/yugioh.service';
import { ViewState } from '../../models/view-state.model';
import { YgoCard } from '../../models/card.model';
import { toViewState } from '../../utils/view-state.operator';
import { StatusMessageComponent } from '../status-message/status-message.component';
import { CardPrintsComponent } from '../card-prints/card-prints.component';

@Component({
  selector: 'app-card-detail',
  standalone: true,
  imports: [CommonModule, StatusMessageComponent, CardPrintsComponent],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly yugioh = inject(YugiohService);

  readonly retry$ = new Subject<void>();

  cardState$: Observable<ViewState<YgoCard | null>> = merge(
    this.route.paramMap,
    this.retry$.pipe(switchMap(() => this.route.paramMap))
  ).pipe(
    map(params => params.get('id')),
    switchMap(idStr => {
      if (!idStr) return of<ViewState<YgoCard | null>>({ status: 'empty' });
      const id = parseInt(idStr, 10);
      if (isNaN(id)) return of<ViewState<YgoCard | null>>({ status: 'empty' });
      return this.yugioh.getCardById(id).pipe(toViewState<YgoCard | null>());
    })
  );

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  hasValue(val: number | undefined | null): boolean {
    return val !== undefined && val !== null;
  }
}
