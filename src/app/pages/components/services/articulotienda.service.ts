import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ArticuloTienda } from '../models/articulotienda.model';

@Injectable({
  providedIn: 'root'
})
export class ArticuloTiendaService {
  base_path = environment.apiUrl;

  constructor( private http: HttpClient) { }

  upsert(data:ArticuloTienda[]): Observable<any>{
    return this.http.post(this.base_path + 'ArticuloTienda', data);
  }

  getAll(): Observable<any>{
    return this.http.get(this.base_path + 'Cliente/GetAll');
  }

  get(id: number): Observable<any>{
    return this.http.get(this.base_path + 'ArticuloTienda/Get/' + id);
  }
}
