import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../client';
import { ClientService } from '../client.service';
import { MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: 'app-simulators',
  templateUrl: './simulators.component.html',
  styleUrls: ['./simulators.component.css']
})
export class SimulatorsComponent implements OnInit {

  // data y current_clien almacena los datos del formulario de contacto para posterior envio a BaseDeDatos
  data: Client[];
  current_clien: Client;

  //curd_oepration variable para guardar el estado del formulario
  crud_operation = { is_new: false, is_visible: false };

  //amortizacionIA y amortizacionF guarda el estado de las tablas de amortizacion
  amortizacionIA = { is_visible: false };
  amortizacionF = { is_visible: false };

  //cerratTabla variable para guardar el estado del boton de cerrar tabla
  cerrarTabla = { is_visible: false };

  //selectIndex guarda el estado del matSlider
  selectedIndex = 0;

  //francesa y alemana variables para uardar el estado de las tablas de datos de simuladores
  francesa = { is_visible: true };
  alemana = { is_visible: false };

  constructor(private service: ClientService, private toastr: ToastrService) {
    this.data = [];
  }

  //*****************************************************
  /*Variables Simuladores Ahorro*/
  //Ahorro Flex
  amount: number;
  term: number;
  returnRate: number;
  retention: number
  total: number;

  //Ahorro DPF
  amountDpf: number;
  termDpf: number;
  returnRateDpf: number;
  retentionDpf: number;
  totalDpf: number;
  //****************************************************** */

  //*****************************************************
  /*Variables Simuladores Credito*/
  //Variables Generales Simuladores Creditos
  tasaInteresAnual: number;
  porcentajeSeguroDesgravamen: number;
  tasaInteresPeriodica: number;
  valorPrestamo: number;
  tiempoPrestamo: number;
  numeroDePagosPorAno: number;
  numeroCuotas: number;
  valorSeguroDesgravamen: number;

  //Variables para calcular la simulacion de los creditos Sistema Aleman
  interesDelPeriodoIA: number;
  capitalAmortizadoIA: number;
  cuotaPagarIA: number;
  saldoRemanenteIA: number;
  dataAleman = [];
  sumaIntereses: number;

  // variables para calcular la simulacion de los creditos Sistema Frances
  interesDelPeriodoF: number;
  capitalAmortizadoF: number;
  cuotaPagarF: number;
  saldoRemanenteF: number;
  dataFrances = [];
  sumaInteresesF: number;
  base: number;
  cuotaFrancesa: number;

  /***************************************************** */

/**Variables Creditos para guardar peticiones del API */
tasaCreditoEducativo:number;
tasaCreditoInversion:number;
tasaCreditoInmobiliario:number;
montoMinCreditoEducativo:number;
montoMinCreditoInversion:number;
montoMinCreditoInmobiliario:number;
montoMaxCreditoEducativo:number;
montoMaxCreditoInversion:number;
montoMaxCreditoInmobiliario:number;
tiempoMinCreditoEducativo:number;
tiempoMinCreditoInversion:number;
tiempoMinCreditoInmobiliario:number;
tiempoMaxCreditoEducativo:number;
tiempoMaxCreditoInversion:number;
tiempoMaxCreditoInmobiliario:number;

/**Variables Ahorros para guardar peticiones del API */

tasaAhorroFlexSave:number;
tasaAhorroDpf:number;
tiempoMinAhorroFlexSave:number;
tiempoMinAhorroDpf:number;
tiempoMaxAhorroFlexSave:number;
tiempoMaxAhorroDpf:number;

/**Varibles para almacenar las consultas api de credito y ahorro */
datosFlexSaving=null;
datosDpfSaving=null;
datosCreditoEducativo=null;
datosCreditoInversion=null;
datosCreditoInmobiliario=null;

porcentajeSD=null;

ngOnInit(): void {
  this.service.getFlexSaving().subscribe(
    (datos)=>{
      this.datosFlexSaving=datos;
      for( let x of this.datosFlexSaving){
        // console.log(x.name);
        this.tasaAhorroFlexSave=x.rate;
        this.tiempoMinAhorroFlexSave=x.minimum_time;
        this.tiempoMaxAhorroFlexSave=x.maximum_time;
        // console.log(this.tiempoMaxAhorroDpf);
      }
    },
    (error)=>{
      console.log(error);
    }
  )
  this.service.getDpfSaving().subscribe(
    (datos)=>{
      this.datosDpfSaving=datos;
      for( let x of this.datosDpfSaving){
        // console.log(x.name);
        this.tasaAhorroDpf=x.rate;
        this.tiempoMinAhorroDpf=x.minimum_time;
        this.tiempoMaxAhorroDpf=x.maximum_time;
        // console.log(this.tiempoMaxAhorroDpf);
      }
    },
    (error)=>{
      console.log(error);
    }
  )
  this.service.getCreditoEducativo().subscribe(
    (datos)=>{
      this.datosCreditoEducativo=datos;
      for( let x of this.datosCreditoEducativo){
        // console.log(x.name);
       this.tasaCreditoEducativo=x.tasa;
       this.montoMinCreditoEducativo=x.montomin;
       this.montoMaxCreditoEducativo=x.montomax;
       this.tiempoMinCreditoEducativo=x.tiempomin;
       this.tiempoMaxCreditoEducativo=x.tiempomax;
      }
      console.log("tiempo min educativo",this.tiempoMinCreditoEducativo);
    },
    (error)=>{
      console.log(error);
    }
  )
  this.service.getCreditoInversion().subscribe(
    (datos)=>{
      this.datosCreditoInversion=datos;
      for( let x of this.datosCreditoInversion){
        // console.log(x.name);
       this.tasaCreditoInversion=x.tasa;
       this.montoMinCreditoInversion=x.montomin;
       this.montoMaxCreditoInversion=x.montomax;
       this.tiempoMinCreditoInversion=x.tiempomin;
       this.tiempoMaxCreditoInversion=x.tiempomax;
      }
      console.log(this.tiempoMaxCreditoInversion);
    },
    (error)=>{
      console.log(error);
    }
  )
  this.service.getCreditoInmobiliario().subscribe(
    (datos)=>{
      this.datosCreditoInmobiliario=datos;
      for( let x of this.datosCreditoInmobiliario){
        // console.log(x.name);
       this.tasaCreditoInmobiliario=x.tasa;
       this.montoMinCreditoInmobiliario=x.montomin;
       this.montoMaxCreditoInmobiliario=x.montomax;
       this.tiempoMinCreditoInmobiliario=x.tiempomin;
       this.tiempoMaxCreditoInmobiliario=x.tiempomax;
      }
      console.log(this.tiempoMaxCreditoInmobiliario);
    },
    (error)=>{
      console.log(error);
    }
  )
  this.porcentajeSD = 0.0688;
  console.log("segurod",this.porcentajeSeguroDesgravamen);

}


  cerrarTablas(): void {
    this.amortizacionF.is_visible = false;
    this.amortizacionIA.is_visible = false;
  }

  vetTablaIA() {
    this.amortizacionIA.is_visible = true;
    this.cerrarTabla.is_visible = true
  }
  vetTablaFrancesa() {
    this.amortizacionF.is_visible = true;
    this.cerrarTabla.is_visible = true
  }

  verFrancesa(): void {
    this.francesa.is_visible = true;
    this.alemana.is_visible = false;
    this.cerrarTablas();

  }

  verAlemana(): void {
    this.alemana.is_visible = true;
    this.francesa.is_visible = false;
    this.cerrarTablas();
  }

  /************************************************************************ */
  //Funciones para capturar cambio de pestana

  @ViewChild("mattabgroup", { static: false }) mattabgroup: MatTabGroup;

  _selectedTabChange(index: number) {
    console.log("_selectTabChange " + index);
    this.limpiarDatos();
    if (index == 3 || index == 4) {
      this.francesa.is_visible = false;
    }
    else {
      this.francesa.is_visible = true;
    }
  }

  _selectedIndexChange(index: number) {
    console.log("_selectedIndexChange " + index);
  }

  _select(index: number) {
    console.log("_select " + index);
    this.selectedIndex = index;

  }

  /****************************************************************** */

  limpiarDatos(): void {
    this.tasaInteresAnual = 0;
    this.porcentajeSeguroDesgravamen = 0;
    this.tasaInteresPeriodica = 0;
    this.valorPrestamo = 0;
    this.tiempoPrestamo = 0;
    this.numeroDePagosPorAno = -0
    this.numeroCuotas = 0;
    this.interesDelPeriodoIA = 0;
    this.capitalAmortizadoIA = 0;
    this.valorSeguroDesgravamen = 0;
    this.cuotaPagarIA = 0;
    this.saldoRemanenteIA = 0;
    this.dataAleman = [];
    this.dataFrances = [];
    this.sumaIntereses = 0;
    this.interesDelPeriodoF = 0;
    this.capitalAmortizadoF = 0;
    this.cuotaPagarF = 0;
    this.saldoRemanenteF = 0;
    this.sumaInteresesF = 0;
    this.base = 0;
    this.cuotaFrancesa = 0;
    this.amortizacionIA.is_visible = false;
    this.alemana.is_visible = false;
  }

  limpiarTabla(): void {
    this.dataAleman = [];
    this.dataFrances = [];
  }


  /************************************************************* */
  /**Funciones Simuladores de Credito */

  simuladorInversion(): void {
    this.limpiarTabla();
    // this.verFrancesa();
    // this.numeroCuotas = this.tiempoPrestamo * 12;
    // this.valorPrestamo = 5000;
    // this.numeroCuotas= 6;
    this.capitalAmortizadoIA = this.valorPrestamo / this.numeroCuotas;
    this.capitalAmortizadoF = 0;
    this.saldoRemanenteIA = this.valorPrestamo;
    this.tasaInteresAnual = 13;
    this.tasaInteresPeriodica = this.tasaInteresAnual / 12;
    this.porcentajeSeguroDesgravamen = 0.0688 / 100;
    this.sumaIntereses = 0;
    this.sumaInteresesF = 0;
    this.base = 1 + this.tasaInteresPeriodica / 100;
    this.saldoRemanenteF = this.valorPrestamo;
    this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo);
    if (this.valorPrestamo > 100000 || this.valorPrestamo < 5000) {
      this.valorPrestamo = 5000;
      // this.tiempoPrestamo=0;
      this.toastr.warning('Monto Maximo $30.000 Monto Minimo $5.000 ', 'Limite Superado', {
        timeOut: 4500,
      });
    } else if (this.numeroCuotas > 60 || this.numeroCuotas <6) {
      this.numeroCuotas= 6;
      this.toastr.warning('Tiempo Maximo 20 Años, Tiempo Minimo 1 Año', 'Limite Superado', {
        timeOut: 4500,
      });
    } else {
      for (let i = 0; i < this.numeroCuotas; i++) {
        this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
        this.interesDelPeriodoF = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
        this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
        this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.valorSeguroDesgravamen;
        this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodica / 100;
        this.cuotaFrancesa = this.valorSeguroDesgravamen + this.cuotaPagarF;
        this.capitalAmortizadoF = this.cuotaFrancesa - this.interesDelPeriodoF;
        this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
        this.dataFrances.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoF,
          capitalAmortizado: this.capitalAmortizadoF,
          seguro: this.valorSeguroDesgravamen,
          cuotaPagar: this.cuotaFrancesa,
          saldoRemanente: this.saldoRemanenteF
        });
        this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
        this.sumaInteresesF = this.sumaInteresesF + this.interesDelPeriodoF;
        this.dataAleman.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoIA,
          capitalAmortizado: this.capitalAmortizadoIA,
          seguro: this.valorSeguroDesgravamen,
          cuotaPagar: this.cuotaPagarIA,
          saldoRemanente: this.saldoRemanenteIA
        });
        this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
        this.sumaIntereses = this.sumaIntereses + this.interesDelPeriodoIA;
      }
    }
  }

  simuladorInmobiliario(): void {
    this.limpiarTabla();
    // this.verFrancesa();
    // this.numeroCuotas = this.tiempoPrestamo * 12;
    this.capitalAmortizadoIA = this.valorPrestamo / this.numeroCuotas;
    this.capitalAmortizadoF = 0;
    this.saldoRemanenteIA = this.valorPrestamo;
    this.tasaInteresAnual = 9;
    this.tasaInteresPeriodica = this.tasaInteresAnual / 12;
    this.porcentajeSeguroDesgravamen = 0.0688 / 100;
    this.sumaIntereses = 0;
    this.sumaInteresesF = 0;
    this.base = 1 + this.tasaInteresPeriodica / 100;
    this.saldoRemanenteF = this.valorPrestamo;
    this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo);
    if (this.valorPrestamo > 100000 || this.valorPrestamo < 50000) {
      this.valorPrestamo = 0;
      // this.tiempoPrestamo=0;
      this.toastr.warning('Monto Maximo $100.000 Monto Minimo $50.000 ', 'Limite Superado', {
        timeOut: 4500,
      });
    } else if (this.numeroCuotas > 244 || this.numeroCuotas<12) {
      this.numeroCuotas
      this.toastr.warning('Tiempo Maximo 20 Años, Tiempo Minimo 1 Año', 'Limite Superado', {
        timeOut: 4500,
      });
    } else {
      for (let i = 0; i < this.numeroCuotas; i++) {
        this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
        this.interesDelPeriodoF = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
        this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
        this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.valorSeguroDesgravamen;
        this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodica / 100;
        this.cuotaFrancesa = this.valorSeguroDesgravamen + this.cuotaPagarF;
        this.capitalAmortizadoF = this.cuotaFrancesa - this.interesDelPeriodoF;
        this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
        this.dataFrances.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoF,
          capitalAmortizado: this.capitalAmortizadoF,
          seguro: this.valorSeguroDesgravamen,
          cuotaPagar: this.cuotaFrancesa,
          saldoRemanente: this.saldoRemanenteF
        });
        this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
        this.sumaInteresesF = this.sumaInteresesF + this.interesDelPeriodoF;
        this.dataAleman.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoIA,
          capitalAmortizado: this.capitalAmortizadoIA,
          seguro: this.valorSeguroDesgravamen,
          cuotaPagar: this.cuotaPagarIA,
          saldoRemanente: this.saldoRemanenteIA
        });
        this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
        this.sumaIntereses = this.sumaIntereses + this.interesDelPeriodoIA;
      }
    }
  }

  simuladorEducativo(): void {
    this.limpiarTabla();
    // this.verFrancesa();
    // this.numeroCuotas = this.tiempoPrestamo * 12;
    // this.numeroCuotas=6;
    this.capitalAmortizadoIA = this.valorPrestamo / this.numeroCuotas;
    this.capitalAmortizadoF = 0;
    this.saldoRemanenteIA = this.valorPrestamo;
    this.tasaInteresAnual = this.tasaCreditoEducativo;
    this.tasaInteresPeriodica = this.tasaInteresAnual / 12;
    this.porcentajeSeguroDesgravamen = 0.0688 / 100;
    this.sumaIntereses = 0;
    this.sumaInteresesF = 0;
    this.base = 1 + this.tasaInteresPeriodica / 100;
    this.saldoRemanenteF = this.valorPrestamo;
    // this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo);
    this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo);
    if (this.valorPrestamo > this.montoMaxCreditoEducativo || this.valorPrestamo<this.montoMinCreditoEducativo) {
      this.valorPrestamo = this.montoMinCreditoEducativo;
      // this.tiempoPrestamo=0;
      this.toastr.warning('Monto Maximo $30.000, Monto Minimo $1000 ', 'Valor Fuera de Rango', {
        timeOut: 4500,

      });
    } else if (this.numeroCuotas > this.tiempoMaxCreditoEducativo || this.numeroCuotas<this.tiempoMinCreditoEducativo ) {
      this.numeroCuotas = this.tiempoMinCreditoEducativo;
      this.toastr.warning('Tiempo Maximo 48 Meses, Tiempo Minimo 6 Meses', 'Valor Fuera de Rango', {
        timeOut: 4500,

      });
    }
    else {
      for (let i = 0; i < this.numeroCuotas; i++) {
        this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
        this.interesDelPeriodoF = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
        this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
        this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.valorSeguroDesgravamen;
        // this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA;
        this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodica / 100;
        this.cuotaFrancesa = this.valorSeguroDesgravamen + this.cuotaPagarF;
        // this.cuotaFrancesa =  this.cuotaPagarF;
        this.capitalAmortizadoF = this.cuotaFrancesa - this.interesDelPeriodoF;
        this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;

        this.dataFrances.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoF,
          capitalAmortizado: this.capitalAmortizadoF,
          seguro: this.valorSeguroDesgravamen,
          cuotaPagar: this.cuotaFrancesa,
          saldoRemanente: this.saldoRemanenteF
        });
        this.sumaInteresesF = this.sumaInteresesF + this.interesDelPeriodoF;
        this.dataAleman.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoIA,
          capitalAmortizado: this.capitalAmortizadoIA,
          seguro: this.valorSeguroDesgravamen,
          cuotaPagar: this.cuotaPagarIA,
          saldoRemanente: this.saldoRemanenteIA
        });
        this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
        this.sumaIntereses = this.sumaIntereses + this.interesDelPeriodoIA;
      }
    }

  }
  /************************************************************************** */

  /************************************************************************** */
  //Funciones Simuladores de Ahorro

  flexSave(): void {
    this.returnRate = this.amount * this.term * this.tasaAhorroFlexSave / 360 / 100;
    this.retention = this.returnRate * 0.02;
    this.total = this.amount + this.returnRate - this.retention;
  }
  dpfSave(): void {
    this.returnRateDpf = this.amountDpf * this.termDpf * this.tasaAhorroDpf / 360 / 100 * 30.4167;
    this.retentionDpf = this.returnRateDpf * 0.02;
    this.totalDpf = this.amountDpf + this.returnRateDpf - this.retentionDpf;
  }

  /******************************************************************************** */




  /************************************** */
  //Funciones para Guardar el formulario de cliente mediante el api
  new() {
    this.current_clien = new Client();
    this.crud_operation.is_visible = true;
    this.crud_operation.is_new = true;
  }

  save() {
    if (this.crud_operation.is_new) {
      this.toastr.success('Ingresado Exitosamente', 'Cliente', {
        timeOut: 1500,
      });
      this.crud_operation.is_visible = false;
      this.service.insert(this.current_clien).subscribe(res => {
        this.current_clien = new Client();
      });
      return;
    }
  }
  /********************************** */

  /************************************************ */
  //Funciones formato mat-slider
  formatoTiempo(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'd';
    }
    return value;
  }
  formatoMonto(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

}
