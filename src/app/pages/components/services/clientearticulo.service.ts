import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ArticuloTienda } from '../models/articulotienda.model';
import { ClienteArticulo } from '../models/clientearticulo.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteArticuloService {
  base_path = environment.apiUrl;

  constructor( private http: HttpClient) { }

  upsert(data:ClienteArticulo[]): Observable<any>{
    return this.http.post(this.base_path + 'ClienteArticulo', data);
  }
  delete(id): Observable<any>{
    return this.http.delete(this.base_path + 'ClienteArticulo/'+id);
  }

  getAll(): Observable<any>{
    return this.http.get(this.base_path + 'ClienteArticulo/GetAll');
  }

  get(id: number): Observable<any>{
    return this.http.get(this.base_path + 'ClienteArticulo/Get/' + id);
  }
}
