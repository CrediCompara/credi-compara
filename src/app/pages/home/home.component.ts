import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MortgageCredit} from 'src/app/models/mortgage-credit';
import {MatSelectChange} from '@angular/material/select';
import {RatesApiService} from 'src/app/services/rates-api.service';
import {Rates} from 'src/app/models/rates';
import {Calculate} from './calculate';
import {UserApiService} from 'src/app/services/user-api.service';
import {TokenStorageService} from 'src/app/services/token-storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  calculateForm: FormGroup;
  calculate: Calculate;
  dataSourceList : MortgageCredit[] = [];
  assetstList: string[] = [];
  classList: string[] = [];
  scotia_img: string = "../../../assets/images/scotia.png";
  interb_img: string = "../../../assets/images/interb.jpg";
  typer_years: number[] = [360, 365];
  minDate = new Date();
  rateList: Rates[]=[]
  sol: Boolean = true;
  isFill: Boolean = false;
  onlyNumberPattern: string = "^[0-9]*$";
  listNumber: number[]=[]

  constructor(private formBuilder: FormBuilder, private ratesApi: RatesApiService,
              private userApi: UserApiService, private tokenStorage: TokenStorageService,
              private _snackBar: MatSnackBar,
             ) {
    this.calculate = new Calculate();
    this.calculateForm = this.formBuilder.group({
      property_value: [null, [Validators.required, Validators.min(1000), Validators.pattern(this.onlyNumberPattern)]],
      income: [null, [Validators.required, Validators.pattern(this.onlyNumberPattern)]],
      term: [null, Validators.required],
      initial_fee: [null, Validators.required],
      currency: [null, Validators.required],
      method: [null, Validators.required],
      initial_date: [null, Validators.required],
      type_year: [null, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.dataSourceList = [];
    this.assetstList = [];
    this.listNumber =[]; 
    this.getRates();
    this.isFill = true;


  }

  onCalculate(income: number, initial_fee:number,method: string,
              property_value:number, term:number, rate: Rates,
              currency:string, n_dias_anio: number, initial_date: Date): void{
    if(rate.bank_id == 1){
      this.assetstList.push(this.scotia_img);
      this.assetstList.push(this.scotia_img);
      this.classList.push("scotiabank");
      this.classList.push("scotiabank");
    }

    else{
      this.assetstList.push(this.interb_img);
      this.assetstList.push(this.interb_img);
      this.classList.push("interbank");
      this.classList.push("interbank");
    }
    this.listNumber.push(rate.bank_id);
    this.listNumber.push(rate.bank_id);

    switch(method) {
      case "frances": {
        // Min Rate
        this.calculate.french_method(property_value, initial_fee/100, term, rate.min_rate/100, n_dias_anio, initial_date);
        this.nextCalculate(income, initial_fee, property_value, term, currency);
        // Max Rate
        this.calculate.french_method(property_value, initial_fee/100, term, rate.max_rate/100, n_dias_anio, initial_date);
        this.nextCalculate(income, initial_fee, property_value, term, currency);

        break;
      }
      case "aleman": {
        // Min Rate
        console.log(rate.min_rate)
        console.log(rate)
        this.calculate.german_method(property_value, initial_fee/100, term, rate.max_rate/100, n_dias_anio, initial_date);
        this.nextCalculate(income, initial_fee, property_value, term, currency);
        // Max Rate
        this.calculate.german_method(property_value, initial_fee/100, term, rate.max_rate/100, n_dias_anio, initial_date);
        this.nextCalculate(income, initial_fee, property_value, term, currency);


        break;
      }
      case "americano": {
        // Min Rate
        console.log(rate.min_rate)
        console.log(rate)
        this.calculate.american_method(property_value, initial_fee/100, term, rate.max_rate/100, n_dias_anio, initial_date);
        this.nextCalculate(income, initial_fee, property_value, term, currency);
        // Max Rate
        this.calculate.american_method(property_value, initial_fee/100, term, rate.max_rate/100, n_dias_anio, initial_date);
        this.nextCalculate(income, initial_fee, property_value, term, currency);


        break;
      }
      default: {
        break;
      }
    }
  }

  nextCalculate(income: number, initial_fee:number,
              property_value:number, term:number, currency:string): void{
    const mortgage = {} as MortgageCredit;
    mortgage.term = term;
    mortgage.initial_fee =initial_fee;
    mortgage.currency = currency;
    mortgage.property_value = property_value;
    mortgage.monthly_fee = -(this.calculate.cuotas[this.calculate.cuotas.length-1]);
    mortgage.incomes = income;
    mortgage.tcea = 11.0;
    this.dataSourceList.push(mortgage);
  }

  getRates(): void {
    const currency = this.calculateForm.value.currency;
    const income = parseFloat(this.calculateForm.value.income);
    const initial_fee = this.calculateForm.value.initial_fee;
    const method = this.calculateForm.value.method;
    const property_value = parseFloat(this.calculateForm.value.property_value);
    const term = this.calculateForm.value.term;
    const n_dias_anio = this.typer_years[parseInt(this.calculateForm.value.type_year)];
    const initial_date: Date = this.calculateForm.value.initial_date;
    this.ratesApi.getRateByValueAndFeeValue(term, property_value, currency).subscribe((res: Rates[]) => {
      res.forEach(rate => {

        this.onCalculate(income, initial_fee, method, property_value, term, rate, currency, n_dias_anio, initial_date);

      })
    },
    error =>{
      this.error();
      this.calculateForm.reset();
    }
      );
  }

  handleSaveButton(index: number): void{
    const button_heart = document.getElementById(index.toString())
    if (button_heart != null){
      if(button_heart.textContent === "favorite"){
          this.userApi.saveMortgageCreditByUserId(this.dataSourceList[index], this.tokenStorage.getUser().id, this.listNumber[index]).subscribe((res: MortgageCredit) => {
            this.dataSourceList[index].id = res.id;
            button_heart.innerText = "check_circle";
          })
      }else{
        console.log(button_heart.textContent);
        this.userApi.deleteMortgageCreditByUserId(this.dataSourceList[index].id).subscribe((res: any) => {
          button_heart.innerText = "favorite";
        })
      }
    }
  }

  error(): void {
    this._snackBar.open("No existe tasas para los valores dados", '', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  handleSelectionChange(event: MatSelectChange) {
    if(event.value != "sol"){
      this.sol = false;
    }else this.sol = true;
  }
  formatSliderInitialFee(value: number){
    return value + '%';
  }
}
