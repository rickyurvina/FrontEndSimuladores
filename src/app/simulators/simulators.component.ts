import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simulators',
  templateUrl: './simulators.component.html',
  styleUrls: ['./simulators.component.css']
})
export class SimulatorsComponent implements OnInit {
  hide = true;

  constructor() { }
  amount: number;
  term: number;
  returnRate: number;
  retention:number
  total: number;

  amountDpf: number;
  termDpf: number;
  returnRateDpf: number;
  retentionDpf:number;
  totalDpf: number;

  ngOnInit(): void {
  }

  onCalc(): void {

    this.returnRate = this.amount * this.term * 3.5 / 360 / 100;
    this.retention= this.returnRate*0.02;
    this.total = this.amount + this.returnRate-this.retention;
  }
  onCalc2(): void {
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
