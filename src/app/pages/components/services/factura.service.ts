import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  base_path = environment.apiUrl;

  constructor( private http: HttpClient) { }

  upsert(data): Observable<any>{
    return this.http.post(this.base_path + 'Factura', data);
  }

  getAll(): Observable<any>{
    return this.http.get(this.base_path + 'Factura/GetAll');
  }
  getNewInstance(): Observable<any>{
    return this.http.get(this.base_path + 'Factura/GetNewInstance');
  }
  getAllByCliente(id,numero): Observable<any>{
    return this.http.get(this.base_path + 'Factura/GetAllByCliente/'+id+'/'+numero);
  }
  get(id: number): Observable<any>{
    return this.http.get(this.base_path + 'Factura/Get/' + id);
  }
}