import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ViewState } from '../../models/view-state.model';

/*
  Patrón de uso en el padre:
  @if (vm$ | async; as vm) {
    @if (vm.status === 'success') { ...contenido con vm.data... }
    @else { <app-status-message [state]="vm" (retry)="..."></app-status-message> }
  }
*/
@Component({
  selector: 'app-status-message',
  standalone: true,
  imports: [],
  templateUrl: './status-message.component.html',
  styleUrl: './status-message.component.css'
})
export class StatusMessageComponent {
  @Input({ required: true }) state!: ViewState<unknown>;
  @Input() emptyText = 'No se encontraron resultados.';
  @Input() idleText = '';
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
