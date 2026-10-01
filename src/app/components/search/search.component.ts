import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, merge, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  startWith,
} from 'rxjs/operators';
import { YugiohService } from '../../services/yugioh.service';
import { ViewState } from '../../models/view-state.model';
import { YgoCard } from '../../models/card.model';
import { toViewState } from '../../utils/view-state.operator';
import { StatusMessageComponent } from '../status-message/status-message.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, StatusMessageComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  private readonly yugioh = inject(YugiohService);
  
  searchControl = new FormControl<string>('', { nonNullable: true });
  private readonly retry$ = new Subject<void>();

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
}
