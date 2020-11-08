import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Client } from '../client';
import { ClientService }  from '../client.service';

@Component({
  selector: 'app-simulators',
  templateUrl: './simulators.component.html',
  styleUrls: ['./simulators.component.css']
})
export class SimulatorsComponent implements OnInit {
  hide = true;
  data:Client[];
  current_clien:Client;
  crud_operation={is_new:false, is_visible:false};
  amortizacionIA={is_visible:false};


  constructor(private service: ClientService, private toastr: ToastrService) {
    this.data=[];
   }
   //Ahorro Flex
  amount: number;
  term: number;
  returnRate: number;
  retention:number
  total: number;
   //Ahorro DPF
  amountDpf: number;
  termDpf: number;
  returnRateDpf: number;
  retentionDpf:number;
  totalDpf: number;

  //Credito Inversión Aleman


  tasaInteresAnualIA:number;
  seguroDesgravamenIA:number;
  tasaInteresPeriodicaIA:number;
  valorPrestamoIA:number;
  tiempoPrestamoIA:number;
  numeroDePagosPorAnoIA:number;
  numeroCuotasIA:number;
  interesDelPeriodoIA:number;
  capitalAmortizadoIA:number;
  seguroIA:number;
  cuotaPagarIA:number;
  saldoRemanenteIA:number;
  dataIA=[];
  sumaIntereses:number;

  vetTablaIA(){

    this.amortizacionIA.is_visible=true;

  }


  inversionAleman(): void {
    this.numeroCuotasIA=this.tiempoPrestamoIA*12;
    this.capitalAmortizadoIA=this.valorPrestamoIA/this.numeroCuotasIA;
    this.saldoRemanenteIA=this.valorPrestamoIA;
    this.tasaInteresAnualIA=13;
    this.tasaInteresPeriodicaIA=this.tasaInteresAnualIA/12;
    this.seguroDesgravamenIA=0.0688/100;
    this.sumaIntereses=0;

    for(let i=0; i<this.numeroCuotasIA;i++){

      this.interesDelPeriodoIA=this.saldoRemanenteIA*this.tasaInteresPeriodicaIA/100;
      this.seguroIA=this.saldoRemanenteIA*this.seguroDesgravamenIA/12;
      this.cuotaPagarIA=this.interesDelPeriodoIA+this.capitalAmortizadoIA+this.seguroIA;
      this.dataIA.push({numeroCuota: i+1,
        interesPeriodo:this.interesDelPeriodoIA,
        capitalAmortizado:this.capitalAmortizadoIA,
        seguro:this.seguroIA,
        cuotaPagar:this.cuotaPagarIA,
      saldoRemanente:this.saldoRemanenteIA
    });
    this.saldoRemanenteIA=this.saldoRemanenteIA-this.capitalAmortizadoIA;
    this.sumaIntereses=this.sumaIntereses+this.interesDelPeriodoIA;

    }
    console.log(this.dataIA);


  }




  ngOnInit(): void {
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

  flexSave(): void {

    this.returnRate = this.amount * this.term * 3.5 / 360 / 100;
    this.retention= this.returnRate*0.02;
    this.total = this.amount + this.returnRate-this.retention;
  }
  dpfSave(): void {
    this.returnRateDpf = this.amountDpf * this.termDpf * 5 / 360 / 100 * 30.4167;
    this.retentionDpf= this.returnRateDpf*0.02;
    this.totalDpf = this.amountDpf + this.returnRateDpf-this.retentionDpf;
  }




  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'd';
    }

    return value;
  }
  formatLabel2(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

}
