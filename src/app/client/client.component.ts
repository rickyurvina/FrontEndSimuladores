import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Client } from '../client';
import { ClientService }  from '../client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  data:Client[];
  current_clien:Client;
  crud_operation={is_new:false, is_visible:false};



  constructor(private service: ClientService, private toastr: ToastrService) {
    this.data=[];




  }

  ngOnInit(): void {
    // this.service.read().subscribe(res=>{
    //   this.data= res.json();
    //   this.current_clien= new Client();
    // })

  }
   new(){
     this.current_clien= new Client();
     this.crud_operation.is_visible=true;
     this.crud_operation.is_new=true;
   }

   save(){

     if(this.crud_operation.is_new){
      this.toastr.success('Ingresado Exitosamente', 'Cliente',{
        timeOut:1500,

      });
      this.crud_operation.is_visible=false;
       this.service.insert(this.current_clien).subscribe(res =>{

        // this.current_clien= new Client();
        //  this.ngOnInit();
       });

       return;
     }

   }

}
