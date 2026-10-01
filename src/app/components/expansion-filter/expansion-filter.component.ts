import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expansion-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expansion-filter.component.html',
  styleUrl: './expansion-filter.component.css'
})
export class ExpansionFilterComponent {
  @Input() expansions: string[] = [];
  @Input() selected: string | null = null;
  @Output() expansionChange = new EventEmitter<string | null>();

  onChange(value: string): void {
    this.expansionChange.emit(value === '' ? null : value);
  }

  clearFilter(): void {
    this.expansionChange.emit(null);
  }
}
