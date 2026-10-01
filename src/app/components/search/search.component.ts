import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, merge, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  startWith,
  tap
} from 'rxjs/operators';
import { YugiohService } from '../../services/yugioh.service';
import { ViewState } from '../../models/view-state.model';
import { YgoCard } from '../../models/card.model';
import { toViewState } from '../../utils/view-state.operator';
import { StatusMessageComponent } from '../status-message/status-message.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, StatusMessageComponent, CardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  private readonly yugioh = inject(YugiohService);
  private readonly router = inject(Router);
  
  searchControl = new FormControl<string>('', { nonNullable: true });
  private readonly retry$ = new Subject<void>();

  visibleCount = signal<number>(60);

  results$: Observable<ViewState<YgoCard[]>> = merge(
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      map(v => v.trim()),
      debounceTime(400),
      distinctUntilChanged()
    ),
    this.retry$.pipe(
      map(() => this.searchControl.value.trim())
    )
  ).pipe(
    tap(() => this.visibleCount.set(60)),
    switchMap(term =>
      term.length < 2
        ? of<ViewState<YgoCard[]>>({ status: 'idle' })
        : this.yugioh.searchByName(term).pipe(toViewState<YgoCard[]>())
    )
  );

  clear(): void {
    this.searchControl.setValue('');
  }

  onRetry(): void {
    this.retry$.next();
  }

  openDetail(card: YgoCard): void {
    this.router.navigate(['/card', card.id]);
  }

  showMore(): void {
    this.visibleCount.update(count => count + 60);
  }
}
