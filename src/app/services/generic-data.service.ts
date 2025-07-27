import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class GenericDataService<T, C> {
  protected constructor(
    protected http: HttpClient,
    protected apiUrl: string
  ) {}

  getAll(): Observable<T[]> {
    console.log(`Fetching all items from ${this.apiUrl}`);
    return this.http.get<T[]>(this.apiUrl).pipe(
      tap(data => console.log(`Received ${data.length} items from ${this.apiUrl}`)),
      catchError(error => {
        console.error(`Error fetching items from ${this.apiUrl}:`, error);
        throw error;
      })
    );
  }

  getById(id: number): Observable<T> {
    console.log(`Fetching item with id ${id} from ${this.apiUrl}`);
    return this.http.get<T>(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log(`Received item with id ${id} from ${this.apiUrl}:`, data)),
      catchError(error => {
        console.error(`Error fetching item with id ${id} from ${this.apiUrl}:`, error);
        throw error;
      })
    );
  }

  create(item: C): Observable<T> {
    console.log(`Creating item at ${this.apiUrl} with data:`, item);
    return this.http.post<T>(this.apiUrl, item).pipe(
      tap(data => console.log(`Created item at ${this.apiUrl}, response:`, data)),
      catchError(error => {
        console.error(`Error creating item at ${this.apiUrl}:`, error);
        throw error;
      })
    );
  }

  update(id: number, item: T): Observable<T> {
    console.log(`Updating item with id ${id} at ${this.apiUrl} with data:`, item);
    return this.http.put<T>(`${this.apiUrl}/${id}`, item).pipe(
      tap(data => console.log(`Updated item with id ${id} at ${this.apiUrl}, response:`, data)),
      catchError(error => {
        console.error(`Error updating item with id ${id} at ${this.apiUrl}:`, error);
        throw error;
      })
    );
  }

  delete(id: number): Observable<any> {
    console.log(`Deleting item with id ${id} from ${this.apiUrl}`);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log(`Deleted item with id ${id} from ${this.apiUrl}, response:`, data)),
      catchError(error => {
        console.error(`Error deleting item with id ${id} from ${this.apiUrl}:`, error);
        throw error;
      })
    );
  }
}
