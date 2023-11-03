import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent,HttpEventType } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {
  base_path = environment.apiUrl;

  constructor( private http: HttpClient) { }

  upsert(data): Observable<any>{
    return this.http.post(this.base_path + 'Articulo', data);
  }

  getAll(): Observable<any>{
    return this.http.get(this.base_path + 'Articulo/GetAll');
  }
  getAllImagen(id): Observable<any>{
    return this.http.get(this.base_path + 'Articulo/GetAllImagen/'+ id);
  }


  get(id: number): Observable<any>{
    return this.http.get(this.base_path + 'Articulo/Get/' + id);
  }
  upload(formData): Observable<any> {
    return this.http
      .post<any>(this.base_path + 'Articulo/Upload', formData
        , {
          reportProgress: true,
          observe: 'events'
        }
      )
      .pipe(
        //retry(2),
        catchError(this.handleError),
        map(event => this.getEventMessage(event, formData))
      )
  }
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('Ha ocurrido un error:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend 0 el código ${error.status}, ` +
        `body : ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Ha ocurrido un error; Intenta de nuevo.');
  };
  private getEventMessage(event: HttpEvent<any>, formData) {

    switch (event.type) {
      case HttpEventType.UploadProgress:
        // console.log('cargando...'+event.loaded);
        return this.fileUploadProgress(event);
        break;
      case HttpEventType.Response:
        //console.log('response...'+JSON.stringify(event));
        return this.apiResponse(event);
        break;
      default:
        // return `File "${formData.get('profile').name}" surprising upload event: ${event.type}.`;
        return `File surprising upload event: ${event.type}.`;
    }
  }
  private fileUploadProgress(event) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    //console.log('Porcentaje ... '+percentDone);
    return { status: 'progress', message: percentDone };
  }

  private apiResponse(event) {
    return event.body;
  }
}
