import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MortgageCredit} from 'src/app/models/mortgage-credit';
import {MatSliderChange} from "@angular/material/slider";
import {MatSelectChange} from '@angular/material/select';
import {RatesApiService} from 'src/app/services/rates-api.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  calculateForm: FormGroup;
  mortgageData: MortgageCredit;
  displayedColumns: string[] = ['id', 'bank', 'term', 'value', 'minRate', 'maxRate', 'favorite'];
  dataSource = new MatTableDataSource();
  sol: Boolean = true;
  isFill: Boolean = false;

  constructor(private formBuilder: FormBuilder, private ratesApi: RatesApiService) {
    this.mortgageData = {} as MortgageCredit;
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
  }
  onInputChange(event:MatSliderChange){
    console.log(event.value)
  }
  handleSelectionChange(event: MatSelectChange) {
    if(event.value != "Soles"){
      this.sol = false;
    }else this.sol = true;
  }
}
