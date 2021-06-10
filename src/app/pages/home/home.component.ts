import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MortgageCredit} from 'src/app/models/mortgage-credit';
import {MatSelectChange} from '@angular/material/select';
import {RatesApiService} from 'src/app/services/rates-api.service';
import {MatTableDataSource} from '@angular/material/table';
import {Rates} from 'src/app/models/rates';
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
  rateCalculate: Rates[];
  displayedColumns: string[] = ['id', 'bank', 'term', 'value', 'minRate', 'maxRate', 'favorite'];
  dataSource = new MatTableDataSource();

  sol: Boolean = true;
  isFill: Boolean = false;
  onlyNumberPattern: string = "^[0-9]*$";

  constructor(private formBuilder: FormBuilder, private ratesApi: RatesApiService) {
    this.mortgageData = {} as MortgageCredit;
    this.calculate = new Calculate();
    this.rateCalculate = [];
    this.calculateForm = this.formBuilder.group({
      property_value: [null, [Validators.required, Validators.min(1000), Validators.pattern(this.onlyNumberPattern)]],
      income: [null, [Validators.required, Validators.pattern(this.onlyNumberPattern)]],
      term: [null, null],
      initial_fee: [null, null],
      currency: [null, null]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.getRates();
  }

  getRates(): void {
    this.ratesApi.getRateByValueAndFeeValue().subscribe( res => {
      this.rateCalculate = res;
      //this.dataSource.data = response;
      this.onCalculate();
      //this.isFill = true;
    })
  }

  handleSelectionChange(event: MatSelectChange) {
    if(event.value != "Soles"){
      this.sol = false;
    }else this.sol = true;
  }
  formatSliderInitialFee(value: number){
    return value + '%'
  }

  onCalculate() {
    console.log(this.rateCalculate[0])
    console.log(this.mortgageData);
    this.calculate.mainCalc(this.rateCalculate[0].minRate/100, this.mortgageData.property_value,
                            this.mortgageData.term*12, this.mortgageData.initial_fee/100);
    console.log(this.calculate.cuotaMensual)
    console.log(this.calculate.tcea)
  }
}
