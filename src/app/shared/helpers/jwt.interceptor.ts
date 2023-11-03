import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { CookieService} from 'ngx-cookie-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    
    constructor(private authenticationService: AuthenticationService, private cookieService:CookieService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
       // let token= this.authenticationService.getAuthToken();//funciona
       let jwt = this.cookieService.get('jwt');//obtiene el jwt desde la cookie
     
      // console.log('jason web token   '+jwt);
        let currentUser = this.authenticationService.currentUserValue;
        //if (currentUser && currentUser.access_Token) {
            if (currentUser && jwt) {//si hay un usuario cargado y existe el jwt
            request = request.clone({
                setHeaders: {
                    // Authorization: `Bearer ${currentUser.access_Token}` //activar esta linea para tomar los datos del localstorage o session storage
                    Authorization: `Bearer ${jwt}`
                }
            });
        }
        return next.handle(request);
    }
}