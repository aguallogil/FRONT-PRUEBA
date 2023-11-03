import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  base_path = environment.apiUrl;

  constructor( private http: HttpClient) { }

  upsert(data): Observable<any>{
    return this.http.post(this.base_path + 'Producto', data);
  }

  getAll(): Observable<any>{
    return this.http.get(this.base_path + 'Producto/GetAll');
  }

  getAllImagen(id): Observable<any>{
    return this.http.get(this.base_path + 'Producto/GetAllImagen/' + id);
  }

  get(id: number): Observable<any>{
    return this.http.get(this.base_path + 'Producto/Get/' + id);
  }

  upload(formData): Observable<any> {
    return this.http
      .post<any>(this.base_path + 'Producto/Upload', formData, {
          reportProgress: true,
          observe: 'events'
        }
      )
      .pipe(
        catchError(this.handleError),
        map(event => this.getEventMessage(event, formData))
      )
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ha ocurrido un error:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Ha ocurrido un error; por favor intenta de nuevo.');
  }

  private getEventMessage(event: HttpEvent<any>, formData) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);
      case HttpEventType.Response:
        return this.apiResponse(event);
      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }

  private fileUploadProgress(event) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { status: 'progress', message: percentDone };
  }

  private apiResponse(event) {
    return event.body;
  }
}
