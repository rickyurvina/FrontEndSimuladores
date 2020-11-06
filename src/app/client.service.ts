import { Injectable } from '@angular/core';

import {Client} from './client';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  data:Client[];

  constructor(private http:HttpClient) { }

  // read(){
  //   return this.http.get('http://127.0.0.1:8000/client');
  // }
  insert(data:Client){

    return this.http.post('http://127.0.0.1:8000/api/client',data);
    // return this.http.post('https://backend-proccredit.azurewebsites.net/',data);

  }
}
