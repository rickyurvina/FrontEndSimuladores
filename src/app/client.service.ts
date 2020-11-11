import { Injectable } from '@angular/core';

import {Client} from './client';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  data:Client[];
  url:string;



  constructor(private http:HttpClient) { }

  getFlexSaving(){
    return this.http.get(environment.url+"/flexSaving");
  }
  getDpfSaving(){
    return this.http.get(environment.url+'/dpfSaving');
  }
  getCreditoEducativo(){
    return this.http.get(environment.url+'/creditoEducativo');
  }
  getCreditoInversion(){
    return this.http.get(environment.url+'/creditoInversion');
  }
  getCreditoInmobiliario(){
    return this.http.get(environment.url+'/creditoInmobiliario');
  }
  insert(data:Client){

    return this.http.post(environment.url+'/client',data, { responseType: 'text'});
    // return this.http.post('https://backend-proccredit.azurewebsites.net/api/client',data, { responseType: 'text'});

  }
}
