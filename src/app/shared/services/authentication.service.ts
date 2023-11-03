import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<Usuario>
  //public userOptions: Observable<Usuario>;
  permisos: any[] = [''];
  constructor(private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('currentUser')));
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  get loggedIn(): boolean {
    return this.currentUserSubject.value!=null;
  }
  // Handle API errors
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

  public get currentUserValue(): Usuario {
    return this.currentUserSubject.value;
  }

  /* #region  Operaciones de Sesión (Iniciar y Cerrar) */
  login(data:Usuario) {
    return this.http.post<Usuario>(`${environment.apiUrl}Account/login`, data,this.httpOptions)
      .pipe(map(user => {
        console.log(user)
        this.cookieService.set('jwt', user.access_Token);//en cookie
        user.access_Token = "";
        localStorage.setItem('currentUser', JSON.stringify(user));//en localStorage
        this.currentUserSubject.next(user);//actualiza el subject para que los demás componentes suscritos lo tengan actualizado
        return user;
      }), retry(2),
        catchError(this.handleError));
  }




  logout() {
    localStorage.removeItem('currentUser');//se elimina del localStorage
    localStorage.removeItem('permisos');
    this.cookieService.delete('jwt');
    this.currentUserSubject.next(null);//actualiza el subject para que los demás componentes suscritos lo tengan actualizado
    this.router.navigate(['/login-form']);
  }
  /* #endregion */

  ///se agrego este metodo para hacer pruebas.. pero tambien funciona
  getAuthToken(): string {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser != null) {
      return currentUser.access_Token;
    }

    return '';
  }
  roleMatch(allowedRoles: string[]): boolean {
    let isMatch = false;
    this.permisos = localStorage.getItem("permisos") as any;//agregue esta linea para que se redirija al link en otra pestaña
    allowedRoles.forEach(element => {
      if (this.permisos.indexOf(element) > -1) {
        isMatch = true;
        return true;
      }
    });
    return isMatch;
  }
  }