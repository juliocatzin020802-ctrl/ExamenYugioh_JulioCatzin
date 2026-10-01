import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { YgoApiResponse, YgoCard } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class YugiohService {
  private readonly API_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
  
  private blueEyesCache$: Observable<YgoCard[]> | null = null;

  constructor(private http: HttpClient) {}

  searchByName(term: string): Observable<YgoCard[]> {
    const params = new HttpParams().set('fname', term);
    return this.http.get<YgoApiResponse>(this.API_URL, { params }).pipe(
      map(response => response.data),
      catchError(error => {
        if (error.status === 400) return of([]);
        return throwError(() => error);
      })
    );
  }

  getCardById(id: number): Observable<YgoCard | null> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<YgoApiResponse>(this.API_URL, { params }).pipe(
      map(response => response.data && response.data.length > 0 ? response.data[0] : null),
      catchError(error => {
        if (error.status === 400) return of(null);
        return throwError(() => error);
      })
    );
  }

  getBlueEyesCards(): Observable<YgoCard[]> {
    if (!this.blueEyesCache$) {
      const params = new HttpParams().set('archetype', 'Blue-Eyes');
      this.blueEyesCache$ = this.http.get<YgoApiResponse>(this.API_URL, { params }).pipe(
        map(response => response.data),
        catchError(error => {
          if (error.status === 400) {
            return of([]);
          }
          this.blueEyesCache$ = null; // Clear cache on real error
          return throwError(() => error);
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.blueEyesCache$;
  }
}
