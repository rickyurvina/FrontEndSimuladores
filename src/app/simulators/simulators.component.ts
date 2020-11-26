import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Client } from '../client';
import { ClientService } from '../client.service';
import { MatTabGroup } from "@angular/material/tabs";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { MatDialog } from '@angular/material/dialog';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { DialogExampleComponent } from '../dialog-example/dialog-example.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
declare var hbspt: any // put this at the top

class Product {
  name: string;
  tasaAnual: number;
  tasaPeriodica: number;
  numeroCuotas: number;
  cuotaPeriodica: number;
  totalInteres: number;
}

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


  //Variables para calcular la simulacion de los creditos Sistema Aleman
  interesDelPeriodoIA: number;
  capitalAmortizadoIA: number;
  cuotaPagarIA: number;
  saldoRemanenteIA: number;
  dataAleman = [];
  sumaIntereses: number;
  valorSeguroDesgravamen: number;
  cuotaInicial:number;
  sumaSeguroDesgravamenA: number;

  // variables para calcular la simulacion de los creditos Sistema Frances
  interesDelPeriodoF: number;
  capitalAmortizadoF: number;
  cuotaPagarF: number;
  saldoRemanenteF: number;
  dataFrances = [];
  sumaInteresesF: number;
  base: number;
  cuotaFrancesa: number;
  valorSeguroDesgravamenF: number;
  sumaSeguroDesgravamenF:number;

  /***************************************************** */

  /**Variables Creditos para guardar peticiones del API */
  tasaCreditoEducativo: number;
  tasaCreditoInversion: number;
  tasaCreditoInmobiliario: number;
  tasaEcoCreditoInmobiliario: number;
  montoMinCreditoEducativo: number;
  montoMinCreditoInversion: number;
  montoMinCreditoInmobiliario: number;
  montoMaxCreditoEducativo: number;
  montoMaxCreditoInversion: number;
  montoMaxCreditoInmobiliario: number;
  tiempoMinCreditoEducativo: number;
  tiempoMinCreditoInversion: number;
  tiempoMinCreditoInmobiliario: number;
  tiempoMaxCreditoEducativo: number;
  tiempoMaxCreditoInversion: number;
  tiempoMaxCreditoInmobiliario: number;

  /**Variables Ahorros para guardar peticiones del API */

  tasaAhorroFlexSave: number;
  tasaAhorroDpf: number;
  tiempoMinAhorroFlexSave: number;
  tiempoMinAhorroDpf: number;
  tiempoMaxAhorroFlexSave: number;
  tiempoMaxAhorroDpf: number;

  /**Varibles para almacenar las consultas api de credito y ahorro */
  datosFlexSaving = null;
  datosDpfSaving = null;
  datosCreditoEducativo = null;
  datosCreditoInversion = null;
  datosCreditoInmobiliario = null;

  porcentajeSD = null;
  nombreProducto: string;
  itemS: number;
  checked = false;


  constructor(private service: ClientService, private toastr: ToastrService, public dialog: MatDialog) {
    this.data = [];
    this.itemS = 0;
    this.nombreProducto = "Ahorro DPF";
    this.francesa.is_visible = false;
    this.termDpf = 6;
    this.term = this.tiempoMinAhorroFlexSave;
    this.amountDpf = 5000;
    this.amount = 1;

  }

  openDialog() {
    this.dialog.open(DialogExampleComponent)
  }

  ngOnInit(): void {
    this.service.getFlexSaving().subscribe(
      (datos) => {
        this.datosFlexSaving = datos;
        for (let x of this.datosFlexSaving) {
          this.tasaAhorroFlexSave = x.rate;
          this.tiempoMinAhorroFlexSave = x.minimum_time;
          this.tiempoMaxAhorroFlexSave = x.maximum_time;
        }
        console.log("TasaFlex", this.tasaAhorroFlexSave);
      },
      (error) => {
        console.log("ERROR DE CONEXION", error);
        this.refresh();
      }
    )
    this.service.getDpfSaving().subscribe(
      (datos) => {
        this.datosDpfSaving = datos;
        for (let x of this.datosDpfSaving) {
          this.tasaAhorroDpf = x.rate;
          this.tiempoMinAhorroDpf = x.minimum_time;
          this.tiempoMaxAhorroDpf = x.maximum_time;
        }
        console.log("tasadpf", this.tasaAhorroDpf)
      },
      (error) => {
        console.log("ERROR DE CONEXION", error);
        this.refresh();
      }
    )
    this.service.getCreditoEducativo().subscribe(
      (datos) => {
        this.datosCreditoEducativo = datos;
        for (let x of this.datosCreditoEducativo) {
          this.tasaCreditoEducativo = x.tasa;
          this.montoMinCreditoEducativo = x.montomin;
          this.montoMaxCreditoEducativo = x.montomax;
          this.tiempoMinCreditoEducativo = x.tiempomin;
          this.tiempoMaxCreditoEducativo = x.tiempomax;
        }
        console.log("tasaeducativo", this.tasaCreditoEducativo)
      },
      (error) => {
        console.log("ERROR DE CONEXION", error);
        this.refresh();
      }
    )
    this.service.getCreditoInversion().subscribe(
      (datos) => {
        this.datosCreditoInversion = datos;
        for (let x of this.datosCreditoInversion) {
          this.tasaCreditoInversion = x.tasa;
          this.montoMinCreditoInversion = x.montomin;
          this.montoMaxCreditoInversion = x.montomax;
          this.tiempoMinCreditoInversion = x.tiempomin;
          this.tiempoMaxCreditoInversion = x.tiempomax;

        }
        console.log("tasainversion", this.tasaCreditoInversion);
      },
      (error) => {
        console.log("ERROR DE CONEXION", error);
        this.refresh();
      }
    )
    this.service.getCreditoInmobiliario().subscribe(
      (datos) => {
        this.datosCreditoInmobiliario = datos;
        for (let x of this.datosCreditoInmobiliario) {
          this.tasaCreditoInmobiliario = x.tasa;
          this.montoMinCreditoInmobiliario = x.montomin;
          this.montoMaxCreditoInmobiliario = x.montomax;
          this.tiempoMinCreditoInmobiliario = x.tiempomin;
          this.tiempoMaxCreditoInmobiliario = x.tiempomax;
          this.tasaEcoCreditoInmobiliario = x.tasa_ecologica;
        }
        console.log("Tasa ecologica", this.tasaEcoCreditoInmobiliario);
      },
      (error) => {
        console.log("ERROR DE CONEXION", error);
        this.refresh();
      }
    )
    this.porcentajeSD = 0.684;

  }

  refresh(): void {

    window.location.reload();
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
    if (index == 0 || index == 1) {
      this.francesa.is_visible = false;
    }
    else {
      this.francesa.is_visible = true;
    }
    if (index == 0) {
      this.itemS = 0;
      this.nombreProducto = "Ahorro Flex Save";
      this.term = this.tiempoMinAhorroFlexSave;
      this.crud_operation.is_visible = false;
      this.flexSave();

    } else if (index == 1) {
      this.itemS = 1;
      this.termDpf = this.tiempoMinAhorroDpf;
      this.nombreProducto = "Ahorro DPF";
      this.dpfSave();

    } else if (index == 2) {
      this.nombreProducto = "Crédito Educativo";
      this.itemS = 2;
      this.valorPrestamo = this.montoMinCreditoEducativo;
      this.numeroCuotas = this.tiempoMinCreditoEducativo;
      this.simuladorEducativo();

    } else if (index == 3) {
      this.nombreProducto = "Credito Inversion";
      this.itemS = 3;
      this.valorPrestamo = this.montoMinCreditoInversion;
      this.numeroCuotas = this.tiempoMinCreditoInversion;
      this.simuladorInversion();

    } else {
      this.itemS = 4;
      this.nombreProducto = "Credito Inmobilirio ";
      this.valorPrestamo = this.montoMinCreditoInmobiliario;
      this.numeroCuotas = this.tiempoMinCreditoInmobiliario;
      this.simuladorInmobiliario();
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
    /**Variables globales para los dos sistemas */
    this.tasaInteresAnual = this.tasaCreditoInversion;
    this.tasaInteresPeriodica = this.tasaInteresAnual / 12;
    this.porcentajeSeguroDesgravamen = 0.684 / 100;
    /**Validacion montos y tiempo */
    if (this.valorPrestamo > this.montoMaxCreditoInversion || this.valorPrestamo < this.montoMinCreditoInversion) {
      this.valorPrestamo = this.montoMinCreditoInversion;
      this.toastr.warning('Monto Maximo $30.000, Monto Minimo $1000 ', 'Monto Fuera de Rango', {
        timeOut: 4500,
      });
    } else if (this.numeroCuotas > this.tiempoMaxCreditoInversion || this.numeroCuotas < this.tiempoMinCreditoInversion) {
      this.numeroCuotas = this.tiempoMinCreditoInversion;
      this.toastr.warning('Tiempo Maximo 48 Meses, Tiempo Minimo 6 Meses', 'Tiempo Fuera de Rango', {
        timeOut: 4500,
      });
    }
    else {
       /**Calculo Frances */
      //valores calculo frances
      this.capitalAmortizadoF = 0;
      this.sumaInteresesF = 0;
      this.sumaSeguroDesgravamenF=0;
      this.base = 1 + this.tasaInteresPeriodica / 100;
      this.saldoRemanenteF = this.valorPrestamo;
      this.valorSeguroDesgravamenF = this.saldoRemanenteF * this.porcentajeSeguroDesgravamen / 12;
      this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodica / 100;
      this.cuotaFrancesa=((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo);
      this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo) + this.valorSeguroDesgravamenF;
      this.capitalAmortizadoF = this.cuotaFrancesa - this.interesDelPeriodoF;
      this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
      for (let i = 0; i < this.numeroCuotas; i++) {

        this.dataFrances.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoF,
          capitalAmortizado: this.capitalAmortizadoF,
          seguro: this.valorSeguroDesgravamenF,
          cuotaPagar: this.cuotaPagarF,
          saldoRemanente: this.saldoRemanenteF
        });
        this.sumaSeguroDesgravamenF=this.sumaSeguroDesgravamenF+this.valorSeguroDesgravamenF
        this.sumaInteresesF = this.sumaInteresesF + this.interesDelPeriodoF;
        this.valorSeguroDesgravamenF = this.saldoRemanenteF * this.porcentajeSeguroDesgravamen / 12;
        this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodica / 100;
        this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo) + this.valorSeguroDesgravamenF;
        this.capitalAmortizadoF = this.cuotaFrancesa - this.interesDelPeriodoF;
        this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
      }
      console.log("suma seguro d", this.sumaSeguroDesgravamenF);

       /**Calculo Aleman */
      //valor fijo capital amortizado calculo aleman
      this.sumaIntereses = 0;
      this.sumaSeguroDesgravamenA=0;
      this.saldoRemanenteIA = this.valorPrestamo;
      this.capitalAmortizadoIA = this.valorPrestamo / this.numeroCuotas;
      //valores calculo aleman
      this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
      this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
      this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.valorSeguroDesgravamen;
      this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
      console.log("interes aleman primera cuota", this.interesDelPeriodoIA);
      this.cuotaInicial=this.cuotaPagarIA;
      for (let i = 0; i < this.numeroCuotas; i++) {
        /**Calculo Aleman */
        // this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
        this.dataAleman.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoIA,
          capitalAmortizado: this.capitalAmortizadoIA,
          seguro: this.valorSeguroDesgravamen,
          cuotaPagar: this.cuotaPagarIA,
          saldoRemanente: this.saldoRemanenteIA
        });
        this.sumaSeguroDesgravamenA=this.sumaSeguroDesgravamenA+this.valorSeguroDesgravamen;
        this.sumaIntereses = this.sumaIntereses + this.interesDelPeriodoIA;
        this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
        this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
        this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.valorSeguroDesgravamen;
        this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
      }
    }

  }

  simuladorInmobiliario(): void {
    this.limpiarTabla();

    if (this.checked) {
      this.tasaInteresAnual = this.tasaEcoCreditoInmobiliario;
    }
    else {
      this.tasaInteresAnual = this.tasaCreditoInmobiliario;
    }
    // this.limpiarTabla();
    /**Variables globales para los dos sistemas */
    // this.tasaInteresAnual = this.tasaCreditoEducativo;
    this.tasaInteresPeriodica = this.tasaInteresAnual / 12;
    this.porcentajeSeguroDesgravamen = 0.684 / 100;
    /**Validacion montos y tiempo */
    if (this.valorPrestamo > this.montoMaxCreditoInmobiliario || this.valorPrestamo < this.montoMinCreditoInmobiliario) {
      this.valorPrestamo = this.montoMinCreditoInmobiliario;
      this.toastr.warning('Monto Maximo $30.000, Monto Minimo $1000 ', 'Monto Fuera de Rango', {
        timeOut: 4500,
      });
    } else if (this.numeroCuotas > this.tiempoMaxCreditoInmobiliario || this.numeroCuotas < this.tiempoMinCreditoInmobiliario) {
      this.numeroCuotas = this.tiempoMinCreditoInmobiliario;
      this.toastr.warning('Tiempo Maximo 48 Meses, Tiempo Minimo 6 Meses', 'Tiempo Fuera de Rango', {
        timeOut: 4500,
      });
    }
    else {
       /**Calculo Frances */
      //valores calculo frances
      this.capitalAmortizadoF = 0;
      this.sumaInteresesF = 0;
      this.sumaSeguroDesgravamenF=0;
      this.base = 1 + this.tasaInteresPeriodica / 100;
      this.saldoRemanenteF = this.valorPrestamo;
      this.valorSeguroDesgravamenF = this.saldoRemanenteF * this.porcentajeSeguroDesgravamen / 12;
      this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodica / 100;
      this.cuotaFrancesa=((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo);
      this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo) + this.valorSeguroDesgravamenF;
      this.capitalAmortizadoF = this.cuotaFrancesa - this.interesDelPeriodoF;
      this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
      for (let i = 0; i < this.numeroCuotas; i++) {

        this.dataFrances.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoF,
          capitalAmortizado: this.capitalAmortizadoF,
          seguro: this.valorSeguroDesgravamenF,
          cuotaPagar: this.cuotaPagarF,
          saldoRemanente: this.saldoRemanenteF
        });
        this.sumaSeguroDesgravamenF=this.sumaSeguroDesgravamenF+this.valorSeguroDesgravamenF
        this.sumaInteresesF = this.sumaInteresesF + this.interesDelPeriodoF;
        this.valorSeguroDesgravamenF = this.saldoRemanenteF * this.porcentajeSeguroDesgravamen / 12;
        this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodica / 100;
        this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo) + this.valorSeguroDesgravamenF;
        this.capitalAmortizadoF = this.cuotaFrancesa - this.interesDelPeriodoF;
        this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
      }
      console.log("suma seguro d", this.sumaSeguroDesgravamenF);

       /**Calculo Aleman */
      //valor fijo capital amortizado calculo aleman
      this.sumaIntereses = 0;
      this.sumaSeguroDesgravamenA=0;
      this.saldoRemanenteIA = this.valorPrestamo;
      this.capitalAmortizadoIA = this.valorPrestamo / this.numeroCuotas;
      //valores calculo aleman
      this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
      this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
      this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.valorSeguroDesgravamen;
      this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
      console.log("interes aleman primera cuota", this.interesDelPeriodoIA);
      this.cuotaInicial=this.cuotaPagarIA;
      for (let i = 0; i < this.numeroCuotas; i++) {
        /**Calculo Aleman */
        // this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
        this.dataAleman.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoIA,
          capitalAmortizado: this.capitalAmortizadoIA,
          seguro: this.valorSeguroDesgravamen,
          cuotaPagar: this.cuotaPagarIA,
          saldoRemanente: this.saldoRemanenteIA
        });
        this.sumaSeguroDesgravamenA=this.sumaSeguroDesgravamenA+this.valorSeguroDesgravamen;
        this.sumaIntereses = this.sumaIntereses + this.interesDelPeriodoIA;
        this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
        this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
        this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.valorSeguroDesgravamen;
        this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
      }
    }

  }

  simuladorEducativo(): void {
    this.limpiarTabla();
    /**Variables globales para los dos sistemas */
    this.tasaInteresAnual = this.tasaCreditoEducativo;
    this.tasaInteresPeriodica = this.tasaInteresAnual / 12;
    this.porcentajeSeguroDesgravamen = 0.684 / 100;
    /**Validacion montos y tiempo */
    if (this.valorPrestamo > this.montoMaxCreditoEducativo || this.valorPrestamo < this.montoMinCreditoEducativo) {
      this.valorPrestamo = this.montoMinCreditoEducativo;
      this.toastr.warning('Monto Maximo $30.000, Monto Minimo $1000 ', 'Monto Fuera de Rango', {
        timeOut: 4500,
      });
    } else if (this.numeroCuotas > this.tiempoMaxCreditoEducativo || this.numeroCuotas < this.tiempoMinCreditoEducativo) {
      this.numeroCuotas = this.tiempoMinCreditoEducativo;
      this.toastr.warning('Tiempo Maximo 48 Meses, Tiempo Minimo 6 Meses', 'Tiempo Fuera de Rango', {
        timeOut: 4500,
      });
    }
    else {
       /**Calculo Frances */
      //valores calculo frances
      this.capitalAmortizadoF = 0;
      this.sumaInteresesF = 0;
      this.sumaSeguroDesgravamenF=0;
      this.base = 1 + this.tasaInteresPeriodica / 100;
      this.saldoRemanenteF = this.valorPrestamo;
      this.valorSeguroDesgravamenF = this.saldoRemanenteF * this.porcentajeSeguroDesgravamen / 12;
      this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodica / 100;
      this.cuotaFrancesa=((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo);
      this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo) + this.valorSeguroDesgravamenF;
      this.capitalAmortizadoF = this.cuotaFrancesa - this.interesDelPeriodoF;
      this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
      for (let i = 0; i < this.numeroCuotas; i++) {

        this.dataFrances.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoF,
          capitalAmortizado: this.capitalAmortizadoF,
          seguro: this.valorSeguroDesgravamenF,
          cuotaPagar: this.cuotaPagarF,
          saldoRemanente: this.saldoRemanenteF
        });
        this.sumaSeguroDesgravamenF=this.sumaSeguroDesgravamenF+this.valorSeguroDesgravamenF
        this.sumaInteresesF = this.sumaInteresesF + this.interesDelPeriodoF;
        this.valorSeguroDesgravamenF = this.saldoRemanenteF * this.porcentajeSeguroDesgravamen / 12;
        this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodica / 100;
        this.cuotaPagarF = ((this.tasaInteresPeriodica / 100) / (1 - (Math.pow(this.base, -this.numeroCuotas))) * this.valorPrestamo) + this.valorSeguroDesgravamenF;
        this.capitalAmortizadoF = this.cuotaFrancesa - this.interesDelPeriodoF;
        this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoF;
      }
      console.log("suma seguro d", this.sumaSeguroDesgravamenF);

       /**Calculo Aleman */
      //valor fijo capital amortizado calculo aleman
      this.sumaIntereses = 0;
      this.sumaSeguroDesgravamenA=0;
      this.saldoRemanenteIA = this.valorPrestamo;
      this.capitalAmortizadoIA = this.valorPrestamo / this.numeroCuotas;
      //valores calculo aleman
      this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
      this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
      this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.valorSeguroDesgravamen;
      this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
      console.log("interes aleman primera cuota", this.interesDelPeriodoIA);
      this.cuotaInicial=this.cuotaPagarIA;
      for (let i = 0; i < this.numeroCuotas; i++) {
        /**Calculo Aleman */
        // this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
        this.dataAleman.push({
          numeroCuota: i + 1,
          interesPeriodo: this.interesDelPeriodoIA,
          capitalAmortizado: this.capitalAmortizadoIA,
          seguro: this.valorSeguroDesgravamen,
          cuotaPagar: this.cuotaPagarIA,
          saldoRemanente: this.saldoRemanenteIA
        });
        this.sumaSeguroDesgravamenA=this.sumaSeguroDesgravamenA+this.valorSeguroDesgravamen;
        this.sumaIntereses = this.sumaIntereses + this.interesDelPeriodoIA;
        this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodica / 100;
        this.valorSeguroDesgravamen = this.saldoRemanenteIA * this.porcentajeSeguroDesgravamen / 12;
        this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.valorSeguroDesgravamen;
        this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
      }
    }

  }
  /************************************************************************** */

  /************************************************************************** */
  //Funciones Simuladores de Ahorro

  flexSave(): void {
    console.log("tiempo min felxsave", this.tiempoMinAhorroFlexSave)
    if (this.term < this.tiempoMinAhorroFlexSave || this.term > this.tiempoMaxAhorroFlexSave) {
      this.term = this.tiempoMinAhorroFlexSave;
      this.toastr.warning('Limites Fuera de Rango ', 'Advertencia', {
        timeOut: 4500,
      });

    } else {
      this.returnRate = this.amount * this.term * this.tasaAhorroFlexSave / 360 / 100;
      this.retention = this.returnRate * 0.02;
      this.total = this.amount + this.returnRate - this.retention;
    }

  }
  dpfSave(): void {
    if (this.tasaAhorroDpf == null) {
      this.ngOnInit();
    }
    else {
      console.log("tiempo min dpf", this.tiempoMinAhorroDpf);
      if (this.termDpf < this.tiempoMinAhorroDpf || this.termDpf > this.tiempoMaxAhorroDpf) {
        this.amountDpf = 5000;
        this.termDpf = this.tiempoMinAhorroDpf;
        this.toastr.warning('Limites Fuera de Rango ', 'Advertencia', {
          timeOut: 4500,
        });

      } else {
        this.returnRateDpf = this.amountDpf * this.termDpf * this.tasaAhorroDpf / 360 / 100 * 30.4167;
        this.retentionDpf = this.returnRateDpf * 0.02;
        this.totalDpf = this.amountDpf + this.returnRateDpf - this.retentionDpf;
      }
    }

  }

  /******************************************************************************** */

  /************************************** */
  //Funciones para Guardar el formulario de cliente mediante el api
  new() {
    this.current_clien = new Client();
    this.crud_operation.is_visible = true;
    this.crud_operation.is_new = true;
    hbspt.forms.create({
      portalId: "8821548",
      formId: "b3e4925e-7ec3-45ef-b106-e085420d9091",
      target: "#hubspotForm"
    });
    window.scrollTo(0, 0);
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
      this.valorPrestamo = value;
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }
  onInputChangeMonto(event: any) {
    console.log(event.value);
    this.valorPrestamo = event.value;
  }

  onInputChangeMontoFlex(event: any) {
    console.log(event.value);
    this.amount = event.value;
  }

  onInputChangeMontoDpf(event: any) {
    console.log(event.value);
    this.amountDpf = event.value;

  }

  onInputChangeTiempo(event: any) {
    console.log(event.value);
    this.numeroCuotas = event.value;
  }
  onInputChangeTiempoFlex(event: any) {
    console.log(event.value);
    this.term = event.value;
  }
  onInputChangeTiempoDpf(event: any) {
    console.log(event.value);
    this.termDpf = event.value;
  }

  generatePDF(action = 'download') {

    if (this.itemS == 2 && this.francesa.is_visible) {
      //credito educativo
      let docDefinition = {
        content: [
          {
            text: 'BANCO PROCREDIT',
            fontSize: 16,
            alignment: 'center',
            color: '#da1d2c'
          },

          {
            columns: [

              [
                {
                  text: `Fecha: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                {
                  text: `Producto : ${this.nombreProducto}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Detalles Simulación',
            style: 'sectionHeader'
          },

          {
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto'],
              body: [
                [{ text: 'Monto del Prestamo', bold: true }, `$${this.valorPrestamo.toFixed(2)}`],
                [{ text: 'Plazo (Meses)', bold: true }, `${this.numeroCuotas}`],
                [{ text: 'Tasa Interés Periodica', bold: true }, `${this.tasaInteresPeriodica.toFixed(2)}`],
                [{ text: 'Cuota a Pagar Periodicamente', bold: true }, `$${this.cuotaPagarF.toFixed(2)}`],
                [{ text: 'Total Interés a Pagar', bold: true }, `$${this.sumaInteresesF.toFixed(2)}`],
              ]
            }
          },
          {
            text: 'Tabla de Amortización Francesa',
            style: 'sectionHeader'
          },

          {
            style: 'tableExample',
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: '#Cuotas', style: 'tableHeader' }, 'Interés del Periodo', 'Capital Amortizado', 'Seguro', 'Cuota a Pagar', 'Saldo Remanente'],
                ...this.dataFrances.map(p => ([p.numeroCuota, '$' + p.interesPeriodo.toFixed(2), '$' + p.capitalAmortizado.toFixed(2), '$' + p.seguro.toFixed(2), '$' + p.cuotaPagar.toFixed(2), '$' + p.saldoRemanente.toFixed(2)]))

              ],

            }
          },

          {
            text: 'Visita Nuestra Página',
            style: 'sectionHeader'
          },
          {
            columns: [
              [{ qr: `https://www.bancoprocredit.com.ec/`, fit: '100' }],
            ]
          },

        ],
        styles: {
          table: {
            bold: true,
            fontSize: 10,
            alignment: 'center',
            decorationColor: 'red'

          },
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          },
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableOpacityExample: {
            margin: [0, 5, 0, 15],
            fillColor: 'blue',
            fillOpacity: 0.3
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'red',
            background: 'black'
          }
        }
      };
      if (action === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).download();
      }
    } else if (this.itemS == 2 && this.alemana.is_visible) {
      // credito educativo Simulacion Alemana
      let docDefinition = {
        content: [
          {
            text: 'BANCO PROCREDIT',
            fontSize: 16,
            alignment: 'center',
            color: '#da1d2c'
          },

          {
            columns: [

              [
                {
                  text: `Fecha: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                {
                  text: `Producto : ${this.nombreProducto}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Detalles Simulación',
            style: 'sectionHeader'
          },

          {
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto'],
              body: [
                [{ text: 'Monto del Prestamo', bold: true }, `$${this.valorPrestamo.toFixed(2)}`],
                [{ text: 'Plazo (Meses)', bold: true }, `${this.numeroCuotas}`],
                [{ text: 'Tasa Interés Periodica', bold: true }, `${this.tasaInteresPeriodica.toFixed(2)}`],
                // [{ text: 'Cuota a Pagar Periodicamente', bold: true }, `$${this.cuotaPagarF.toFixed(2)}`],
                [{ text: 'Total Interés a Pagar', bold: true }, `$${this.sumaIntereses.toFixed(2)}`],
              ]
            }
          },
          {
            text: 'Tabla de Amortización Alemana',
            style: 'sectionHeader'
          },

          {
            style: 'tableExample',
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: '#Cuotas', style: 'tableHeader' }, 'Interés del Periodo', 'Capital Amortizado', 'Seguro', 'Cuota a Pagar', 'Saldo Remanente'],
                ...this.dataAleman.map(p => ([p.numeroCuota, '$' + p.interesPeriodo.toFixed(2), '$' + p.capitalAmortizado.toFixed(2), '$' + p.seguro.toFixed(2), '$' + p.cuotaPagar.toFixed(2), '$' + p.saldoRemanente.toFixed(2)]))

              ],

            }
          },

          {
            text: 'Visita Nuestra Página',
            style: 'sectionHeader'
          },
          {
            columns: [
              [{ qr: `https://www.bancoprocredit.com.ec/`, fit: '100' }],
            ]
          },

        ],
        styles: {
          table: {
            bold: true,
            fontSize: 10,
            alignment: 'center',
            decorationColor: 'red'

          },
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          },
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableOpacityExample: {
            margin: [0, 5, 0, 15],
            fillColor: 'blue',
            fillOpacity: 0.3
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'red',
            background: 'black'
          }
        }
      };
      if (action === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).download();
      }
    } else if (this.itemS == 3 && this.francesa.is_visible) {
      //credito inversion francesa
      let docDefinition = {
        content: [
          {
            text: 'BANCO PROCREDIT',
            fontSize: 16,
            alignment: 'center',
            color: '#da1d2c'
          },

          {
            columns: [

              [
                {
                  text: `Fecha: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                {
                  text: `Producto : ${this.nombreProducto}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Detalles Simulación',
            style: 'sectionHeader'
          },

          {
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto'],
              body: [
                [{ text: 'Monto del Prestamo', bold: true }, `$${this.valorPrestamo.toFixed(2)}`],
                [{ text: 'Plazo (Meses)', bold: true }, `${this.numeroCuotas}`],
                [{ text: 'Tasa Interés Periodica', bold: true }, `${this.tasaInteresPeriodica.toFixed(2)}`],
                [{ text: 'Cuota a Pagar Periodicamente', bold: true }, `$${this.cuotaPagarF.toFixed(2)}`],
                [{ text: 'Total Interés a Pagar', bold: true }, `$${this.sumaInteresesF.toFixed(2)}`],
              ]
            }
          },
          {
            text: 'Tabla de Amortización Francesa',
            style: 'sectionHeader'
          },

          {
            style: 'tableExample',
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: '#Cuotas', style: 'tableHeader' }, 'Interés del Periodo', 'Capital Amortizado', 'Seguro', 'Cuota a Pagar', 'Saldo Remanente'],
                ...this.dataFrances.map(p => ([p.numeroCuota, '$' + p.interesPeriodo.toFixed(2), '$' + p.capitalAmortizado.toFixed(2), '$' + p.seguro.toFixed(2), '$' + p.cuotaPagar.toFixed(2), '$' + p.saldoRemanente.toFixed(2)]))

              ],

            }
          },

          {
            text: 'Visita Nuestra Página',
            style: 'sectionHeader'
          },
          {
            columns: [
              [{ qr: `https://www.bancoprocredit.com.ec/`, fit: '100' }],
            ]
          },

        ],
        styles: {
          table: {
            bold: true,
            fontSize: 10,
            alignment: 'center',
            decorationColor: 'red'

          },
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          },
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableOpacityExample: {
            margin: [0, 5, 0, 15],
            fillColor: 'blue',
            fillOpacity: 0.3
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'red',
            background: 'black'
          }
        }
      };
      if (action === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).download();
      }
    } else if (this.itemS == 3 && this.alemana.is_visible) {
      // credito inversion Simulacion Alemana
      let docDefinition = {
        content: [
          {
            text: 'BANCO PROCREDIT',
            fontSize: 16,
            alignment: 'center',
            color: '#da1d2c'
          },

          {
            columns: [

              [
                {
                  text: `Fecha: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                {
                  text: `Producto : ${this.nombreProducto}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Detalles Simulación',
            style: 'sectionHeader'
          },

          {
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto'],
              body: [
                [{ text: 'Monto del Prestamo', bold: true }, `$${this.valorPrestamo.toFixed(2)}`],
                [{ text: 'Plazo (Meses)', bold: true }, `${this.numeroCuotas}`],
                [{ text: 'Tasa Interés Periodica', bold: true }, `${this.tasaInteresPeriodica.toFixed(2)}`],
                // [{ text: 'Cuota a Pagar Periodicamente', bold: true }, `$${this.cuotaPagarF.toFixed(2)}`],
                [{ text: 'Total Interés a Pagar', bold: true }, `$${this.sumaIntereses.toFixed(2)}`],
              ]
            }
          },
          {
            text: 'Tabla de Amortización Alemana',
            style: 'sectionHeader'
          },

          {
            style: 'tableExample',
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: '#Cuotas', style: 'tableHeader' }, 'Interés del Periodo', 'Capital Amortizado', 'Seguro', 'Cuota a Pagar', 'Saldo Remanente'],
                ...this.dataAleman.map(p => ([p.numeroCuota, '$' + p.interesPeriodo.toFixed(2), '$' + p.capitalAmortizado.toFixed(2), '$' + p.seguro.toFixed(2), '$' + p.cuotaPagar.toFixed(2), '$' + p.saldoRemanente.toFixed(2)]))

              ],

            }
          },

          {
            text: 'Visita Nuestra Página',
            style: 'sectionHeader'
          },
          {
            columns: [
              [{ qr: `https://www.bancoprocredit.com.ec/`, fit: '100' }],
            ]
          },

        ],
        styles: {
          table: {
            bold: true,
            fontSize: 10,
            alignment: 'center',
            decorationColor: 'red'

          },
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          },
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableOpacityExample: {
            margin: [0, 5, 0, 15],
            fillColor: 'blue',
            fillOpacity: 0.3
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'red',
            background: 'black'
          }
        }
      };
      if (action === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).download();
      }
    } else if (this.itemS == 4 && this.francesa.is_visible) {
      //credito inmobiliario frnaces
      let docDefinition = {
        content: [
          {
            text: 'BANCO PROCREDIT',
            fontSize: 16,
            alignment: 'center',
            color: '#da1d2c'
          },

          {
            columns: [

              [
                {
                  text: `Fecha: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                {
                  text: `Producto : ${this.nombreProducto}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Detalles Simulación',
            style: 'sectionHeader'
          },

          {
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto'],
              body: [
                [{ text: 'Monto del Prestamo', bold: true }, `$${this.valorPrestamo.toFixed(2)}`],
                [{ text: 'Plazo (Meses)', bold: true }, `${this.numeroCuotas}`],
                [{ text: 'Tasa Interés Periodica', bold: true }, `${this.tasaInteresPeriodica.toFixed(2)}`],
                [{ text: 'Cuota a Pagar Periodicamente', bold: true }, `$${this.cuotaPagarF.toFixed(2)}`],
                [{ text: 'Total Interés a Pagar', bold: true }, `$${this.sumaInteresesF.toFixed(2)}`],
              ]
            }
          },
          {
            text: 'Tabla de Amortización Francesa',
            style: 'sectionHeader'
          },

          {
            style: 'tableExample',
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: '#Cuotas', style: 'tableHeader' }, 'Interés del Periodo', 'Capital Amortizado', 'Seguro', 'Cuota a Pagar', 'Saldo Remanente'],
                ...this.dataFrances.map(p => ([p.numeroCuota, '$' + p.interesPeriodo.toFixed(2), '$' + p.capitalAmortizado.toFixed(2), '$' + p.seguro.toFixed(2), '$' + p.cuotaPagar.toFixed(2), '$' + p.saldoRemanente.toFixed(2)]))

              ],

            }
          },

          {
            text: 'Visita Nuestra Página',
            style: 'sectionHeader'
          },
          {
            columns: [
              [{ qr: `https://www.bancoprocredit.com.ec/`, fit: '100' }],
            ]
          },

        ],
        styles: {
          table: {
            bold: true,
            fontSize: 10,
            alignment: 'center',
            decorationColor: 'red'

          },
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          },
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableOpacityExample: {
            margin: [0, 5, 0, 15],
            fillColor: 'blue',
            fillOpacity: 0.3
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'red',
            background: 'black'
          }
        }
      };
      if (action === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).download();
      }

    } else if (this.itemS == 4 && this.alemana.is_visible) {
      // credito inmobiliario Simulacion Alemana
      let docDefinition = {
        content: [
          {
            text: 'BANCO PROCREDIT',
            fontSize: 16,
            alignment: 'center',
            color: '#da1d2c'
          },

          {
            columns: [

              [
                {
                  text: `Fecha: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                {
                  text: `Producto : ${this.nombreProducto}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Detalles Simulación',
            style: 'sectionHeader'
          },

          {
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto'],
              body: [
                [{ text: 'Monto del Prestamo', bold: true }, `$${this.valorPrestamo.toFixed(2)}`],
                [{ text: 'Plazo (Meses)', bold: true }, `${this.numeroCuotas}`],
                [{ text: 'Tasa Interés Periodica', bold: true }, `${this.tasaInteresPeriodica.toFixed(2)}`],
                // [{ text: 'Cuota a Pagar Periodicamente', bold: true }, `$${this.cuotaPagarF.toFixed(2)}`],
                [{ text: 'Total Interés a Pagar', bold: true }, `$${this.sumaIntereses.toFixed(2)}`],
              ]
            }
          },
          {
            text: 'Tabla de Amortización Alemana',
            style: 'sectionHeader'
          },

          {
            style: 'tableExample',
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: '#Cuotas', style: 'tableHeader' }, 'Interés del Periodo', 'Capital Amortizado', 'Seguro', 'Cuota a Pagar', 'Saldo Remanente'],
                ...this.dataAleman.map(p => ([p.numeroCuota, '$' + p.interesPeriodo.toFixed(2), '$' + p.capitalAmortizado.toFixed(2), '$' + p.seguro.toFixed(2), '$' + p.cuotaPagar.toFixed(2), '$' + p.saldoRemanente.toFixed(2)]))

              ],

            }
          },

          {
            text: 'Visita Nuestra Página',
            style: 'sectionHeader'
          },
          {
            columns: [
              [{ qr: `https://www.bancoprocredit.com.ec/`, fit: '100' }],
            ]
          },

        ],
        styles: {
          table: {
            bold: true,
            fontSize: 10,
            alignment: 'center',
            decorationColor: 'red'

          },
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          },
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableOpacityExample: {
            margin: [0, 5, 0, 15],
            fillColor: 'blue',
            fillOpacity: 0.3
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'red',
            background: 'black'
          }
        }
      };
      if (action === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).download();
      }
    } else if (this.itemS == 0) {
      //credito educativo
      let docDefinition = {
        content: [
          {
            text: 'BANCO PROCREDIT',
            fontSize: 16,
            alignment: 'center',
            color: '#da1d2c'
          },

          {
            columns: [

              [
                {
                  text: `Fecha: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                {
                  text: `Producto : ${this.nombreProducto}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Detalles Simulación',
            style: 'sectionHeader'
          },

          {
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto'],
              body: [
                [{ text: 'Monto del Prestamo', bold: true }, `$${this.amountDpf.toFixed(2)}`],
                [{ text: 'Tasa Nominal Vigente (Meses)', bold: true }, `${this.tasaAhorroDpf}%`],
                [{ text: 'Plazo (Meses)', bold: true }, `${this.termDpf}`],
                [{ text: 'Interés Ganado Referencial', bold: true }, `$${this.returnRateDpf.toFixed(2)}`],
                [{ text: 'Retencion IR', bold: true }, `$${this.retentionDpf.toFixed(2)}`],
                [{ text: 'Total a Recibir', bold: true }, `$${this.totalDpf.toFixed(2)}`],
              ]
            }
          },
          {
            text: 'Visita Nuestra Página',
            style: 'sectionHeader'
          },
          {
            columns: [
              [{ qr: `https://www.bancoprocredit.com.ec/`, fit: '100' }],
            ]
          },

        ],
        styles: {
          table: {
            bold: true,
            fontSize: 10,
            alignment: 'center',
            decorationColor: 'red'

          },
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          },
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableOpacityExample: {
            margin: [0, 5, 0, 15],
            fillColor: 'blue',
            fillOpacity: 0.3
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'red',
            background: 'black'
          }
        }
      };
      if (action === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).download();
      }

    } else if (this.itemS == 1) {
      //credito educativo
      let docDefinition = {
        content: [
          {
            text: 'BANCO PROCREDIT',
            fontSize: 16,
            alignment: 'center',
            color: '#da1d2c'
          },

          {
            columns: [

              [
                {
                  text: `Fecha: ${new Date().toLocaleString()}`,
                  alignment: 'right'
                },
                {
                  text: `Producto : ${this.nombreProducto}`,
                  alignment: 'right'
                }
              ]
            ]
          },
          {
            text: 'Detalles Simulación',
            style: 'sectionHeader'
          },

          {
            table: {
              layout: 'lightHorizontalLines', // optional
              headerRows: 1,
              widths: ['auto', 'auto'],
              body: [
                [{ text: 'Monto del Prestamo', bold: true }, `$${this.amount.toFixed(2)}`],
                [{ text: 'Tasa Nominal Vigente (Meses)', bold: true }, `${this.tasaAhorroFlexSave}%`],
                [{ text: 'Plazo (Meses)', bold: true }, `${this.term}`],
                [{ text: 'Interés Ganado Referencial', bold: true }, `$${this.returnRate.toFixed(2)}`],
                [{ text: 'Retencion IR', bold: true }, `$${this.retention.toFixed(2)}`],
                [{ text: 'Total a Recibir', bold: true }, `$${this.total.toFixed(2)}`],
              ]
            }
          },
          {
            text: 'Visita Nuestra Página',
            style: 'sectionHeader'
          },
          {
            columns: [
              [{ qr: `https://www.bancoprocredit.com.ec/`, fit: '100' }],
            ]
          },

        ],
        styles: {
          table: {
            bold: true,
            fontSize: 10,
            alignment: 'center',
            decorationColor: 'red'

          },
          sectionHeader: {
            bold: true,
            decoration: 'underline',
            fontSize: 14,
            margin: [0, 15, 0, 15]
          },
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          },
          tableOpacityExample: {
            margin: [0, 5, 0, 15],
            fillColor: 'blue',
            fillOpacity: 0.3
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'red',
            background: 'black'
          }
        }
      };
      if (action === 'download') {
        pdfMake.createPdf(docDefinition).download();
      } else if (action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else {
        pdfMake.createPdf(docDefinition).download();
      }
    }


  }



}
