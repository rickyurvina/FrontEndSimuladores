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
  hide = true;
  data: Client[];
  current_clien: Client;
  crud_operation = { is_new: false, is_visible: false };
  amortizacionIA = { is_visible: false };
  amortizacionF = { is_visible: false };
  cerrarTabla = { is_visible: false };

  francesa = { is_visible: true };
  alemana = { is_visible: false };


  constructor(private service: ClientService, private toastr: ToastrService) {
    this.data = [];
  }
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

  //Credito Inversión Aleman


  tasaInteresAnualIA: number;
  seguroDesgravamenIA: number;
  tasaInteresPeriodicaIA: number;
  valorPrestamoIA: number;
  tiempoPrestamoIA: number;
  numeroDePagosPorAnoIA: number;
  numeroCuotasIA: number;
  interesDelPeriodoIA: number;
  capitalAmortizadoIA: number;
  seguroIA: number;
  cuotaPagarIA: number;
  saldoRemanenteIA: number;
  dataAleman = [];
  sumaIntereses: number;

  tasaInteresAnualF: number;
  seguroDesgravamenF: number;
  tasaInteresPeriodicaF: number;
  valorPrestamoF: number;
  tiempoPrestamoF: number;
  numeroDePagosPorAnoF: number;
  numeroCuotasF: number;
  interesDelPeriodoF: number;
  capitalAmortizadoFF: number;
  seguroF: number;
  cuotaPagarF: number;
  saldoRemanenteF: number;
  dataFrances = [];
  sumaInteresesF: number;
  base: number;

  cuotaFrancesa: number;

  cerrarTablas():void{
    this.amortizacionF.is_visible=false;
    this.amortizacionIA.is_visible=false;
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


  @ViewChild("mattabgroup", { static: false }) mattabgroup: MatTabGroup;

  selectedIndex = 0;

  _selectedTabChange(index: number) {
    console.log("_selectTabChange " + index);
    this.limpiarDatos();
  }

  _selectedIndexChange(index: number) {
    console.log("_selectedIndexChange " + index);
    // this.limpiarDatos();
  }

  _select(index: number) {
    console.log("_select " + index);
    // if (this.mattabgroup) { this.mattabgroup.selectedIndex = index;  }
    this.selectedIndex = index;
  }

  limpiarDatos(): void {
    this.tasaInteresAnualIA = 0;
    this.seguroDesgravamenIA = 0;
    this.tasaInteresPeriodicaIA = 0;
    this.valorPrestamoIA = 0;
    this.tiempoPrestamoIA = 0;
    this.numeroDePagosPorAnoIA = -0
    this.numeroCuotasIA = 0;
    this.interesDelPeriodoIA = 0;
    this.capitalAmortizadoIA = 0;
    this.seguroIA = 0;
    this.cuotaPagarIA = 0;
    this.saldoRemanenteIA = 0;
    this.dataAleman = [];
    this.dataFrances = [];
    this.sumaIntereses = 0;
    this.amortizacionIA.is_visible = false;
    this.francesa.is_visible = false;
    this.alemana.is_visible = false;
  }

  limpiarTabla(): void {
    this.dataAleman = [];
    this.dataFrances = [];
  }




  inversionAleman(): void {
    this.limpiarTabla();
    this.numeroCuotasIA = this.tiempoPrestamoIA * 12;
    this.capitalAmortizadoIA = this.valorPrestamoIA / this.numeroCuotasIA;
    this.saldoRemanenteIA = this.valorPrestamoIA;
    this.tasaInteresAnualIA = 13;
    this.tasaInteresPeriodicaIA = this.tasaInteresAnualIA / 12;
    this.seguroDesgravamenIA = 0.0688 / 100;
    this.sumaIntereses = 0;
    for (let i = 0; i < this.numeroCuotasIA; i++) {
      this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodicaIA / 100;
      this.seguroIA = this.saldoRemanenteIA * this.seguroDesgravamenIA / 12;
      this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.seguroIA;
      this.dataAleman.push({
        numeroCuota: i + 1,
        interesPeriodo: this.interesDelPeriodoIA,
        capitalAmortizado: this.capitalAmortizadoIA,
        seguro: this.seguroIA,
        cuotaPagar: this.cuotaPagarIA,
        saldoRemanente: this.saldoRemanenteIA
      });
      this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
      this.sumaIntereses = this.sumaIntereses + this.interesDelPeriodoIA;
    }
    console.log(this.dataAleman);
  }

  inmobiliarioAleman(): void {
    this.limpiarTabla();
    this.numeroCuotasIA = this.tiempoPrestamoIA * 12;
    this.capitalAmortizadoIA = this.valorPrestamoIA / this.numeroCuotasIA;
    this.saldoRemanenteIA = this.valorPrestamoIA;
    this.tasaInteresAnualIA = 9;
    this.tasaInteresPeriodicaIA = this.tasaInteresAnualIA / 12;
    this.seguroDesgravamenIA = 0.0688 / 100;
    this.sumaIntereses = 0;
    for (let i = 0; i < this.numeroCuotasIA; i++) {
      this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodicaIA / 100;
      this.seguroIA = this.saldoRemanenteIA * this.seguroDesgravamenIA / 12;
      this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.seguroIA;
      this.dataAleman.push({
        numeroCuota: i + 1,
        interesPeriodo: this.interesDelPeriodoIA,
        capitalAmortizado: this.capitalAmortizadoIA,
        seguro: this.seguroIA,
        cuotaPagar: this.cuotaPagarIA,
        saldoRemanente: this.saldoRemanenteIA
      });
      this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
      this.sumaIntereses = this.sumaIntereses + this.interesDelPeriodoIA;
    }
    console.log(this.dataAleman);
  }

  educativoAleman(): void {
    this.limpiarTabla();
    this.verFrancesa();
    this.numeroCuotasIA = this.tiempoPrestamoIA * 12;
    this.capitalAmortizadoIA = this.valorPrestamoIA / this.numeroCuotasIA;
    this.capitalAmortizadoFF = 0;
    this.saldoRemanenteIA = this.valorPrestamoIA;
    this.tasaInteresAnualIA = 8.5;
    this.tasaInteresPeriodicaIA = this.tasaInteresAnualIA / 12;
    this.seguroDesgravamenIA = 0.0688 / 100;
    this.sumaIntereses = 0;
    this.sumaInteresesF = 0;
    this.base = 1 + this.tasaInteresPeriodicaIA / 100;
    this.saldoRemanenteF = this.valorPrestamoIA;
    this.cuotaPagarF = ((this.tasaInteresPeriodicaIA / 100) / (1 - (Math.pow(this.base, -this.numeroCuotasIA))) * this.valorPrestamoIA);

    for (let i = 0; i < this.numeroCuotasIA; i++) {
      this.interesDelPeriodoIA = this.saldoRemanenteIA * this.tasaInteresPeriodicaIA / 100;
      this.interesDelPeriodoF = this.saldoRemanenteIA * this.tasaInteresPeriodicaIA / 100;
      this.seguroIA = this.saldoRemanenteIA * this.seguroDesgravamenIA / 12;
      this.cuotaPagarIA = this.interesDelPeriodoIA + this.capitalAmortizadoIA + this.seguroIA;
      this.interesDelPeriodoF = this.saldoRemanenteF * this.tasaInteresPeriodicaIA / 100;
      this.cuotaFrancesa = this.seguroIA + this.cuotaPagarF;
      this.capitalAmortizadoFF = this.cuotaFrancesa - this.interesDelPeriodoF;
      this.dataFrances.push({
        numeroCuota: i + 1,
        interesPeriodo: this.interesDelPeriodoF,
        capitalAmortizado: this.capitalAmortizadoFF,
        seguro: this.seguroIA,
        cuotaPagar: this.cuotaFrancesa,
        saldoRemanente: this.saldoRemanenteF
      });
      this.saldoRemanenteF = this.saldoRemanenteF - this.capitalAmortizadoFF;
      this.sumaInteresesF = this.sumaInteresesF + this.interesDelPeriodoF;
      this.dataAleman.push({
        numeroCuota: i + 1,
        interesPeriodo: this.interesDelPeriodoIA,
        capitalAmortizado: this.capitalAmortizadoIA,
        seguro: this.seguroIA,
        cuotaPagar: this.cuotaPagarIA,
        saldoRemanente: this.saldoRemanenteIA
      });
      this.saldoRemanenteIA = this.saldoRemanenteIA - this.capitalAmortizadoIA;
      this.sumaIntereses = this.sumaIntereses + this.interesDelPeriodoIA;

    }
    console.log(this.sumaInteresesF);
    console.log(this.dataFrances);

  }




  ngOnInit(): void {
  }
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

        // this.current_clien= new Client();
        //  this.ngOnInit();
      });

      return;
    }

  }

  flexSave(): void {

    this.returnRate = this.amount * this.term * 3.5 / 360 / 100;
    this.retention = this.returnRate * 0.02;
    this.total = this.amount + this.returnRate - this.retention;
  }
  dpfSave(): void {
    this.returnRateDpf = this.amountDpf * this.termDpf * 5 / 360 / 100 * 30.4167;
    this.retentionDpf = this.returnRateDpf * 0.02;
    this.totalDpf = this.amountDpf + this.returnRateDpf - this.retentionDpf;
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
