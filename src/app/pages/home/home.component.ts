import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MortgageCredit} from 'src/app/models/mortgage-credit';
import {MatSliderChange} from "@angular/material/slider";
import {MatSelectChange} from '@angular/material/select';
import {RatesApiService} from 'src/app/services/rates-api.service';
import {MatTableDataSource} from '@angular/material/table';
import {Rates} from 'src/app/models/rates';
//import {mainCalc} from './calculo';
import {Calculate} from './calculate';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  calculateForm: FormGroup;
  mortgageData: MortgageCredit;
  calculate: Calculate;
  rateCalculate: Rates;
  displayedColumns: string[] = ['id', 'bank', 'term', 'value', 'minRate', 'maxRate', 'favorite'];
  dataSource = new MatTableDataSource();
  sol: Boolean = true;
  isFill: Boolean = false;

  constructor(private formBuilder: FormBuilder, private ratesApi: RatesApiService) {
    this.mortgageData = {} as MortgageCredit;
    this.calculate = {} as Calculate;
    this.rateCalculate = {} as Rates;
    this.mortgageData.currency = "soles";
    this.calculateForm = this.formBuilder.group({
      property_value: [null, null],
      income: [null, null],
      term: [null, null],
      fee_value: [null, null],
      currency: [null, null]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
      console.log(this.mortgageData);
      this.getRates();
  }

  getRates(): void {
    this.ratesApi.getRateByValueAndFeeValue().subscribe((response: any) =>{
      this.dataSource.data = response;
      this.isFill = true;
    })
    this.onCalculate();
  }
  onInputChange(event:MatSliderChange){
    console.log(event.value)
  }
  handleSelectionChange(event: MatSelectChange) {
    if(event.value != "Soles"){
      this.sol = false;
    }else this.sol = true;
  }

  onCalculate() {
    console.log('onCalculate');
    //console.log(this.dataSource.data[0]);
    this.calculate.mainCalc(0.07, 390000, 240, 10000, 0.10)
  }
}
