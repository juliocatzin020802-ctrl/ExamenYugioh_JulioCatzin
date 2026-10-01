import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { ViewState } from '../models/view-state.model';
import { HttpErrorResponse } from '@angular/common/http';

export function toViewState<T>(
  isEmpty: (value: T) => boolean = (val) =>
    val === null || val === undefined || (Array.isArray(val) && val.length === 0)
): OperatorFunction<T, ViewState<T>> {
  return (source$: Observable<T>) =>
    source$.pipe(
      map((data): ViewState<T> => {
        if (isEmpty(data)) {
          return { status: 'empty' };
        }
        return { status: 'success', data };
      }),
      startWith({ status: 'loading' as const }),
      catchError((error) => {
        let message = 'Ocurrió un error inesperado.';
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            message = 'Sin conexión. Revisa tu internet.';
          } else if (error.status >= 500) {
            message = 'Error en el servidor. Intenta más tarde.';
          } else {
            message = `Error ${error.status}: ${error.message}`;
          }
        } else if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === 'string') {
          message = error;
        }
        return of({ status: 'error' as const, message });
      })
    );
}
