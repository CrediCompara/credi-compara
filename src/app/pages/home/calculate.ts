import {irr} from 'financial'


export class Calculate {
  frecuencia_de_pago: number = 30;
  tasa_desgravamen: number = 0.05000/100;
  tasa_seguro_riesgo: number = 0.3/100;

  //Results
  cuotas: number[] = [];
  amortizacion: number[] = [];
  tcea: number = 0.0;
  fechas_de_pago: Date[] = [];
  prom_cuotas: number = 0;


  pmt (rate:number, nper:number, pv:number, fv:number, type:number): number {
    if (!fv) fv = 0;
    if (!type) type = 0;
    if (rate == 0) return -(pv + fv)/nper;
    var pvif = Math.pow(1 + rate, nper);
    var pmt = rate / (pvif - 1) * -(pv * pvif + fv);
    if (type == 1) {
      pmt /= (1 + rate);
    }
    return pmt
  }
  lastday(y: number,m: number, d: number = 0): Date{
    return new Date(y, m, d);
  }

  french_method(precio_venta_activo: number, cuota_inicial: number,
                n_anios: number, tea: number, n_dias_anio:number, initial_date: Date): void{
    // Clear arrays
    this.cuotas = [];
    this.amortizacion = [];
    this.fechas_de_pago = [];
    this.prom_cuotas = 0;

    // Required calculations
    let numero_cuotas_anio = n_dias_anio/this.frecuencia_de_pago;
    let saldo_financiar = precio_venta_activo - precio_venta_activo*cuota_inicial;
    let total_cuotas = numero_cuotas_anio * n_anios;
    let segRies = this.tasa_seguro_riesgo * precio_venta_activo/numero_cuotas_anio;


    let tep = 0;
    let saldo_inicial = 0;
    let saldo_final = 0;
    let interes = 0;
    let cuota_aux = 0;
    const flujos: number[] = [];
    let amort_aux = 0;
    let segDes = 0;
    let segRisk = 0;
    let flujo = saldo_financiar;
    let newDate: Date;

    for(let nc = 1; nc <= total_cuotas; nc++) {

      tep = Math.pow(1+tea, this.frecuencia_de_pago/n_dias_anio) - 1;
      if(nc == 1){
        flujos.push(flujo);
        const newDate = this.lastday(initial_date.getFullYear(), initial_date.getMonth()+1, initial_date.getDate());
        this.fechas_de_pago.push(newDate);
        saldo_inicial = saldo_financiar;
      }
      else {
        newDate = this.lastday(this.fechas_de_pago[nc-2].getFullYear(), this.fechas_de_pago[nc-2].getMonth()+1, initial_date.getDate());
        this.fechas_de_pago.push(newDate)
        saldo_inicial = saldo_final;
      }
      interes = -saldo_inicial * tep;
      cuota_aux = this.pmt(tep+this.tasa_desgravamen, total_cuotas - nc + 1, saldo_inicial, 0, 0);
      this.prom_cuotas += -(cuota_aux);
      this.cuotas.push(-parseFloat(cuota_aux.toFixed(2)));
      segDes = -(saldo_inicial*this.tasa_desgravamen);
      amort_aux = cuota_aux - interes - segDes;
      this.amortizacion.push(-parseFloat(amort_aux.toFixed(2)));
      segRisk = -segRies;


      saldo_final = saldo_inicial+amort_aux;
      flujo = cuota_aux + segRisk;
      flujos.push(flujo);
    }


    let tirr = irr(flujos, 0.01);
    this.tcea = (Math.pow(1+tirr, numero_cuotas_anio)-1) * 100

    this.tcea = parseFloat(this.tcea.toFixed(3))
    this.prom_cuotas = parseFloat((this.prom_cuotas/total_cuotas).toFixed(2));

  }

  german_method(precio_venta_activo: number, cuota_inicial: number,
                n_anios: number, tea: number,  n_dias_anio: number, initial_date: Date): void {
    // Clear arrays
    this.cuotas = [];
    this.amortizacion = [];
    this.fechas_de_pago = [];
    this.prom_cuotas = 0;

    // Required calculations
    let numero_cuotas_anio = n_dias_anio / this.frecuencia_de_pago;
    let saldo_financiar = precio_venta_activo - precio_venta_activo * cuota_inicial;
    let total_cuotas = numero_cuotas_anio * n_anios;
    let segRies = this.tasa_seguro_riesgo * precio_venta_activo / numero_cuotas_anio;


    let tep = 0;
    let saldo_inicial = 0;
    let saldo_final = 0;
    let interes = 0;
    let cuota_aux = 0;
    const flujos: number[] = [];
    let amort_aux = 0;
    let segDes = 0;
    let segRisk = 0;
    let flujo = saldo_financiar;


    for (let nc = 1; nc <= total_cuotas; nc++) {
      flujos.push(flujo);
      tep = Math.pow(1 + tea, this.frecuencia_de_pago / n_dias_anio) - 1;
      if (nc == 1) {
        saldo_inicial = saldo_financiar;
        const newDate = this.lastday(initial_date.getFullYear(), initial_date.getMonth()+1, initial_date.getDate());
        this.fechas_de_pago.push(newDate);
      } else {
        saldo_inicial = saldo_final;
        const newDate = this.lastday(this.fechas_de_pago[nc-2].getFullYear(), this.fechas_de_pago[nc-2].getMonth()+1, initial_date.getDate());
        this.fechas_de_pago.push(newDate)
      }

      interes = -saldo_inicial * tep;
      segDes = -saldo_inicial * this.tasa_desgravamen;
      amort_aux = -saldo_inicial/(total_cuotas - nc +1)
      this.amortizacion.push(-parseFloat(amort_aux.toFixed(2)));
      segRisk = -segRies;
      cuota_aux = interes + amort_aux + segDes;
      this.cuotas.push(-parseFloat(cuota_aux.toFixed(2)));
      this.prom_cuotas += -(cuota_aux);
      saldo_final = saldo_inicial + amort_aux;
      flujo = cuota_aux + segRisk;
      flujos.push(flujo);
    }

    let tirr = irr(flujos, 0.01);
    this.tcea = (Math.pow(1+tirr, numero_cuotas_anio)-1) * 100

    this.tcea = parseFloat(this.tcea.toFixed(3))
    this.prom_cuotas = parseFloat((this.prom_cuotas/total_cuotas).toFixed(2));
  }

  american_method(precio_venta_activo: number, cuota_inicial: number,
                n_anios: number, tea: number,   n_dias_anio: number, initial_date: Date): void {
    // Clear arrays
    this.cuotas = [];
    this.amortizacion = [];
    this.fechas_de_pago = [];
    this.prom_cuotas = 0;

    // Required calculations
    let numero_cuotas_anio = n_dias_anio / this.frecuencia_de_pago;
    let saldo_financiar = precio_venta_activo - precio_venta_activo * cuota_inicial;
    let total_cuotas = numero_cuotas_anio * n_anios;
    let segRies = this.tasa_seguro_riesgo * precio_venta_activo / numero_cuotas_anio;


    let tep = 0;
    let saldo_inicial = 0;
    let saldo_final = 0;
    let interes = 0;
    let cuota_aux = 0;
    const flujos: number[] = [];
    let amort_aux = 0;
    let segDes = 0;
    let segRisk = 0;
    let flujo = saldo_financiar;
    for (let nc = 1; nc <= total_cuotas; nc++) {
      flujos.push(flujo);
      tep = Math.pow(1 + tea, this.frecuencia_de_pago / n_dias_anio) - 1;
      if (nc == 1) {
        saldo_inicial = saldo_financiar;
        const newDate = this.lastday(initial_date.getFullYear(), initial_date.getMonth()+1, initial_date.getDate());
        this.fechas_de_pago.push(newDate);
      } else {
        saldo_inicial = saldo_final;
        const newDate = this.lastday(this.fechas_de_pago[nc-2].getFullYear(), this.fechas_de_pago[nc-2].getMonth()+1, initial_date.getDate());
        this.fechas_de_pago.push(newDate)
      }
      interes = -saldo_inicial * tep;
      segDes = -saldo_inicial * this.tasa_desgravamen;
      if(nc == total_cuotas){
        amort_aux = -saldo_inicial;
      }
      else{
        amort_aux = 0;
      }
      this.amortizacion.push(-parseFloat(amort_aux.toFixed(2)));
      segRisk = -segRies;
      cuota_aux = interes + amort_aux + segDes;
      this.cuotas.push(-parseFloat(cuota_aux.toFixed(2)));
      this.prom_cuotas += -(cuota_aux);
      saldo_final = saldo_inicial + amort_aux;
      flujo = cuota_aux + segRisk;
      flujos.push(flujo)
    }

    let tirr = irr(flujos, 0.01);
    this.tcea = (Math.pow(1+tirr, numero_cuotas_anio)-1) * 100

    this.tcea = parseFloat(this.tcea.toFixed(3))
    this.prom_cuotas = parseFloat((this.prom_cuotas/total_cuotas).toFixed(2));
  }

  peruvian_method(precio_venta_activo: number, cuota_inicial: number,
                n_anios: number, tea: number,   n_dias_anio: number, initial_date: Date): void {
    // Clear arrays
    this.cuotas = [];
    this.amortizacion = [];
    this.fechas_de_pago = [];
    this.prom_cuotas = 0;

    const factor: number[] = [];

    // Required calculations
    let numero_cuotas_anio = n_dias_anio / this.frecuencia_de_pago;
    let saldo_financiar = precio_venta_activo - precio_venta_activo * cuota_inicial;
    let total_cuotas = numero_cuotas_anio * n_anios;
    let segRies = this.tasa_seguro_riesgo * precio_venta_activo / numero_cuotas_anio;

    let n_cuotas_mul = 2;
    let factor_aux = 0;
    let saldo_inicial = 0;
    let saldo_final = 0;
    let interes = 0;
    let cuota_aux = 0;
    const flujos: number[] = [];
    let amort_aux = 0;
    let segDes = 0;
    let segRisk = 0;
    let flujo = saldo_financiar;

    let tep = Math.pow(1+tea, this.frecuencia_de_pago/n_dias_anio) - 1;
    let anualidad = 0;
    let factor_sum = 0;


    for (let nc = 1; nc <= total_cuotas; nc++) {

      if (nc == 1) {
        flujos.push(flujo);
        saldo_inicial = saldo_financiar;
        //const newDate = this.lastday(initial_date.getFullYear(), initial_date.getMonth()+1);
        const newDate = new Date(initial_date.getFullYear(), initial_date.getMonth()+2, 0);
        this.fechas_de_pago.push(newDate);
      }
      else {
        saldo_inicial = saldo_final;
        //const newDate = this.lastday(this.fechas_de_pago[nc-2].getFullYear(), this.fechas_de_pago[nc-2].getMonth()+1);
        const newDate = new Date(this.fechas_de_pago[nc-2].getFullYear(), this.fechas_de_pago[nc-2].getMonth()+2, 0);
        this.fechas_de_pago.push(newDate);
      }
      if((this.fechas_de_pago[nc-1].getMonth()+1 == 7 || this.fechas_de_pago[nc-1].getMonth()+1 == 12) && this.fechas_de_pago[nc-1].getDate() >= 15 ) {
        factor_aux = n_cuotas_mul/Math.pow(1+tep,nc);
      }

      else{
        factor_aux = 1/Math.pow(1+tep,nc);
      }
      factor.push(factor_aux);
      factor_sum += factor_aux;
      anualidad  = saldo_financiar/factor_sum;
    }
    for(let nc = 1; nc <= total_cuotas; nc++){
      interes = -saldo_inicial * tep;
      if((this.fechas_de_pago[nc-1].getMonth()+1 == 7 || this.fechas_de_pago[nc-1].getMonth()+1 == 12) && this.fechas_de_pago[nc-1].getDate() >= 15) {
        cuota_aux = -anualidad * n_cuotas_mul;
      }
      else{
        cuota_aux = -anualidad;
      }
      cuota_aux = parseFloat(cuota_aux.toFixed(2));
      this.cuotas.push(-cuota_aux);
      this.prom_cuotas += -(cuota_aux);

      amort_aux = cuota_aux - interes;
      this.amortizacion.push(amort_aux);
      segDes = -saldo_inicial * this.tasa_desgravamen;
      segRisk = -segRies;
      saldo_final = saldo_inicial + amort_aux;
      console.log(segDes, saldo_inicial, this.tasa_desgravamen)
      flujo = cuota_aux + segRisk + segDes;
      flujos.push(flujo)
    }
    let tirr = irr(flujos, 0.01);
    this.tcea = (Math.pow(1+tirr, n_dias_anio/this.frecuencia_de_pago)-1) * 100

    this.tcea = parseFloat(this.tcea.toFixed(3))
    this.prom_cuotas = parseFloat((this.prom_cuotas/total_cuotas).toFixed(2));
  }

  peruvian_method_two(precio_venta_activo: number, cuota_inicial: number,
                n_anios: number, tea: number,   n_dias_anio: number, initial_date: Date): void {
    // Clear arrays
    this.cuotas = [];
    this.amortizacion = [];
    this.fechas_de_pago = [];

    const factor: number[] = [];

    // Required calculations
    let numero_cuotas_anio = n_dias_anio / this.frecuencia_de_pago;
    let saldo_financiar = precio_venta_activo - precio_venta_activo * cuota_inicial;
    let total_cuotas = numero_cuotas_anio * n_anios;
    let segRies = this.tasa_seguro_riesgo * precio_venta_activo / numero_cuotas_anio;

    let n_cuotas_mul = 2;
    let factor_aux = 0;
    let saldo_inicial = 0;
    let saldo_final = 0;
    let interes = 0;
    let cuota_aux = 0;
    const flujos: number[] = [];
    let amort_aux = 0;
    let segDes = 0;
    let segRisk = 0;
    let flujo = saldo_financiar;
    let tep = Math.pow(1+tea, this.frecuencia_de_pago/n_dias_anio) - 1;
    let anualidad = 0;
    let factor_sum = 0;

    for (let nc = 1; nc <= total_cuotas; nc++) {

      if (nc <= 1) {
        saldo_inicial = saldo_financiar;

        flujos.push(flujo);
        //const newDate = this.lastday(initial_date.getFullYear(), initial_date.getMonth()+1);
        const newDate = new Date(initial_date.getFullYear(), initial_date.getMonth()+2, 0);
        this.fechas_de_pago.push(newDate);
      }
      else {
        saldo_inicial = saldo_final;
        //const newDate = this.lastday(this.fechas_de_pago[nc-2].getFullYear(), this.fechas_de_pago[nc-2].getMonth()+1);
        const newDate = new Date(this.fechas_de_pago[nc-2].getFullYear(), this.fechas_de_pago[nc-2].getMonth()+2, 0);
        this.fechas_de_pago.push(newDate);
      }
      if((this.fechas_de_pago[nc-1].getMonth()+1 == 7 || this.fechas_de_pago[nc-1].getMonth()+1 == 12) && this.fechas_de_pago[nc-1].getDate() >= 15 ) {
        factor_aux = n_cuotas_mul/Math.pow(1+tea, (Math.abs(this.fechas_de_pago[nc-1].getTime() - initial_date.getTime())/(1000 * 60 * 60 * 24))/n_dias_anio);

      }
      else{

        factor_aux = 1/Math.pow(1+tea, (Math.abs(this.fechas_de_pago[nc-1].getTime() - initial_date.getTime())/(1000 * 60 * 60 * 24))/n_dias_anio);
      }
      factor.push(factor_aux);
      factor_sum += factor_aux;
    }
    anualidad  = saldo_financiar/factor_sum;
    for(let nc = 1; nc <= total_cuotas; nc++){

      if(nc <= 1){
        interes = -saldo_inicial *(Math.pow(1+tea,(Math.abs(this.fechas_de_pago[nc-1].getTime() - initial_date.getTime())/(1000 * 60 * 60 * 24))/n_dias_anio)) - 1
      }
      else{

        interes = -saldo_inicial *(Math.pow(1+tea,(Math.abs(this.fechas_de_pago[nc-1].getTime() - this.fechas_de_pago[nc-2].getTime())/(1000 * 60 * 60 * 24))/n_dias_anio)) - 1
      }

      if((this.fechas_de_pago[nc-1].getMonth()+1 == 7 || this.fechas_de_pago[nc-1].getMonth()+1 == 12) && this.fechas_de_pago[nc-1].getDate() >= 15 ) {
        cuota_aux = -anualidad * n_cuotas_mul;
      }
      else{
        cuota_aux = -anualidad;
      }

      cuota_aux = parseFloat(cuota_aux.toFixed(2));
      this.cuotas.push(-cuota_aux);
      this.prom_cuotas += -(cuota_aux);

      amort_aux = cuota_aux - interes;
      this.amortizacion.push(-amort_aux);
      segDes = -saldo_inicial * this.tasa_desgravamen;
      segRisk = -segRies;
      saldo_final = saldo_inicial + amort_aux;
      flujo = cuota_aux + segRisk + segDes;
      flujos.push(flujo);
    }

    let tirr = irr(flujos, 0.01);
    this.tcea = (Math.pow(1+tirr, n_dias_anio/this.frecuencia_de_pago)-1) * 100

    this.tcea = parseFloat(this.tcea.toFixed(3))
    this.prom_cuotas = parseFloat((this.prom_cuotas/total_cuotas).toFixed(2));
  }

}
