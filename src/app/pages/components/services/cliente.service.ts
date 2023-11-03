import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  base_path = environment.apiUrl;

  constructor( private http: HttpClient) { }

  upsert(data): Observable<any>{
    return this.http.post(this.base_path + 'Cliente', data);
  }

  getAll(): Observable<any>{
    return this.http.get(this.base_path + 'Cliente/GetAll');
  }

  get(id: number): Observable<any>{
    return this.http.get(this.base_path + 'Cliente/Get/' + id);
  }
}
