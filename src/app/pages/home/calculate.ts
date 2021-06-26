//import { irr } "financejs";
//import {Finance} from 'financejs'


export class Calculate {

  /*
  // Input
  var valor_inmueble = 390000
  var prestamo_plazo = 240 //meses
  var ingreso_mensual = 10000
  const cuota_inicial_minima_porcentaje = 0.10
  */

  // Rates
  // Tasas --> fake data
  // json
  // estatico tasa_desgravamen: number = 0.000285 tasa_seguro_riesgo: number = 0.00028

  //################## Fields #################
  //comision_envio_estadoDeCuenta: number = 11.0
  //cuota_inicial: number = 0
  /*cuotaMensual: number = 0
  tcea: number = 0
  tasa_desgravamen: number = 0.0285/100
  tasa_seguro_riesgo: number = 0.028/100
  */

  //############## Methods ####################

  // calculo de la cuota inicial
  /*
  calculo_CuotaInicial(vBien: number, ci_porcentaje: number) {
    return vBien * ci_porcentaje
  }
  // Calculo del monto del prestamo
  calculo_MontoDelPrestamo(vBien: number, ci: number) {
    return vBien - ci
  }
  // TEM
  calculo_TEM(i: number) {
    return ((1 + i) ** (1 / 12)) - 1
  }
  // TED
  calculo_TED(im: number) {
    return ((1 + im) ** (1 / 30)) - 1
  }
  // Interes del Periodo
  calculo_InteresPeriodo(id: number, t: number, _S: number) {
    return (((1 + id) ** t) - 1) * _S
  }
  // calculo desgravamen
  calculo_Desgravamen(iD: number, tD: number, _S: number) {
    return (Math.pow((1 + iD),tD / 30) - 1) * _S
  }
  // calculo seguro de riesgo
  calculo_SeguroRiesgo(iB: number, vBien: number) {
    return iB * vBien
  }
  // capital amortizado
  calculo_CapitalAmortizado(
    monto_a_financiar: number,
    tem: number,
    prestamo_plazo: number, interes: number) {
    return ((monto_a_financiar * tem) / (1 - ((1 + tem) ** (-prestamo_plazo)))) - interes
  }
  // cuota mensual
  calculo_CuotaMensual(
    capital_amortizado: number,
    interes_del_periodo: number,
    desgravamen: number,
    seguroRiesgo: number,
    comision_envio_estadoDeCuenta: number) {
    return (capital_amortizado + interes_del_periodo + desgravamen + seguroRiesgo + comision_envio_estadoDeCuenta)
  }
  // Calculo del calendario -> lista de cuotas
  calcular_lista_cuotas(tem: number, ted: number, valor_inmueble: number, fecha_desembolso: Date, prestamo_plazo: number, saldoDeCapital: number, capital_amortizado: number,
    interes_del_periodo: number, desgravamen: number, seguroRiesgo: number, comision_envio_estadoDeCuenta: number) {

    var cuotas = []
    var fechas_de_pago = []
    fecha_desembolso.setDate(fecha_desembolso.getDate() + 30)
    var fecha_de_pago = fecha_desembolso
    while (prestamo_plazo > 0) {

      var cuotaMensual = this.calculo_CuotaMensual(capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo,
        comision_envio_estadoDeCuenta)
      //console.log(fecha_de_pago, prestamo_plazo, saldoDeCapital, capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo, comision_envio_estadoDeCuenta, cuotaMensual)

      cuotas.push(cuotaMensual)
      fechas_de_pago.push(fecha_de_pago)
      // actualizar
      fecha_de_pago.setDate(fecha_de_pago.getDate() + 30)
      saldoDeCapital -= capital_amortizado
      capital_amortizado = this.calculo_CapitalAmortizado(saldoDeCapital, tem, prestamo_plazo, interes_del_periodo)
      interes_del_periodo = this.calculo_InteresPeriodo(ted, 30, saldoDeCapital)
      desgravamen = this.calculo_Desgravamen(this.tasa_desgravamen, 30, saldoDeCapital)
      //seguroRiesgo = this.calculo_SeguroRiesgo(this.tasa_seguro_riesgo, valor_inmueble)
      prestamo_plazo -= 1
    }
    return cuotas
  }
  // TCEM o TIR
  //calcular_TCEM(lista_de_cuotas: number[]) {
    //let finance = new financial();
    //let finance = new Finance();
    //lista_de_cuotas.unshift(-this.cuota_inicial)
    //return fx.IRR(lista_de_cuotas);
    //console.log(lista_de_cuotas);
    //return irr(lista_de_cuotas);
    //return finance.IRR(lista_de_cuotas)
   //return irr(lista_de_cuotas)
  //}
  // TCEA
  calcular_TCEA(tcem: number, n_cuotas_por_anho: number) {
    return (Math.pow((1 + (tcem/100)), n_cuotas_por_anho)) - 1
  }

  mainCalc(tea: number, valor_inmueble: number, prestamo_plazo: number, cuota_inicial_minima: number) {

    // data estatica

    // Monto a Financiar
    // Cuota Inicial y Monto del Prestamo
    this.cuota_inicial = this.calculo_CuotaInicial(valor_inmueble, cuota_inicial_minima)
    const monto_prestamo = this.calculo_MontoDelPrestamo(valor_inmueble, this.cuota_inicial)

    // getRates(ingreso_mensual)

    // Interes
    var t = 30 // diferencia dias entre fecha de desembolso y primera cuota
    var saldoDeCapital = valor_inmueble - this.cuota_inicial
    const tem = this.calculo_TEM(tea)
    const ted = this.calculo_TED(tem)
    const interes_del_periodo = this.calculo_InteresPeriodo(ted, t, monto_prestamo)

    // Seguro de Desgravamen
    const desgravamen = this.calculo_Desgravamen(this.tasa_desgravamen, t, monto_prestamo)
    // Seguro de Riesgo
    const seguroRiesgo = this.calculo_SeguroRiesgo(this.tasa_seguro_riesgo, valor_inmueble)

    // Capital amortizado
    const capital_amortizado = this.calculo_CapitalAmortizado(saldoDeCapital, tem, prestamo_plazo, interes_del_periodo)

    // Cuota Mensual
    this.cuotaMensual = this.calculo_CuotaMensual(capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo, this.comision_envio_estadoDeCuenta)

    // Calculo del Calendario -> Lista de Cuotas
    var fecha_desembolso = new Date()
    var lista_de_cuotas = this.calcular_lista_cuotas(tem, ted, valor_inmueble, fecha_desembolso, prestamo_plazo, saldoDeCapital, capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo, this.comision_envio_estadoDeCuenta)

    // TCEM o TIR
    //var tcem = this.calcular_TCEM(lista_de_cuotas)

    //this.tcea = this.calcular_TCEA(tcem, 12)
  }*/

  //precio_venta_activo: number = 125000;
  //cuota_inicial: number = 0.20;
  //n_anios: number = 15;
  frecuencia_de_pago: number = 30;
  n_dias_anio: number =  360;
  tasa_desgravamen: number = 0.05000/100;
  tasa_seguro_riesgo: number = 0.3/100;
  //tea: number = 0.10;
  //numero_cuotas_anio = this.n_dias_anio/this.frecuencia_de_pago;
  //saldo_financiar = this.precio_venta_activo - this.precio_venta_activo*this.cuota_inicial;
  //total_cuotas = this.numero_cuotas_anio * this.n_anios;
  //segRies = this.tasa_seguro_riesgo * this.precio_venta_activo/this.numero_cuotas_anio;

  //Results
  cuotas: number[] = [];
  amortizacion: number[] = [];
  tcea: number = 0.0;


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

  french_method(precio_venta_activo: number, cuota_inicial: number,
                n_anios: number, tea: number): void{
    // Clear arrays
    this.cuotas = [];
    this.amortizacion = [];

    // Required calculations
    let numero_cuotas_anio = this.n_dias_anio/this.frecuencia_de_pago;
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
    for(let nc = 1; nc <= total_cuotas; nc++) {
      flujos.push(flujo);
      tep = Math.pow(1+tea, this.frecuencia_de_pago/this.n_dias_anio) - 1;
      if(nc == 1){
        saldo_inicial = saldo_financiar;
      }
      else {
        saldo_inicial = saldo_final;
      }
      interes = -saldo_inicial * tep;
      cuota_aux = this.pmt(tep+this.tasa_desgravamen, total_cuotas - nc + 1, saldo_inicial, 0, 0);
      this.cuotas.push(parseFloat(cuota_aux.toFixed(2)));
      segDes = -(saldo_inicial*this.tasa_desgravamen);
      amort_aux = cuota_aux - interes - segDes;
      this.amortizacion.push(parseFloat(amort_aux.toFixed(2)));
      segRisk = -segRies;
      saldo_final = saldo_inicial+amort_aux;
      flujo = cuota_aux + segRisk + segDes;
    }
  }

  german_method(precio_venta_activo: number, cuota_inicial: number,
                n_anios: number, tea: number): void {
    // Clear arrays
    this.cuotas = [];
    this.amortizacion = [];

    // Required calculations
    let numero_cuotas_anio = this.n_dias_anio / this.frecuencia_de_pago;
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
    console.log(flujo)
    for (let nc = 1; nc <= total_cuotas; nc++) {
      flujos.push(flujo);
      tep = Math.pow(1 + tea, this.frecuencia_de_pago / this.n_dias_anio) - 1;
      if (nc == 1) {
        saldo_inicial = saldo_financiar;
      } else {
        saldo_inicial = saldo_final;
      }
      console.log(saldo_inicial, "saldo inicial")
      interes = -saldo_inicial * tep;
      console.log(interes, "interes")
      segDes = -saldo_inicial * this.tasa_desgravamen;
      console.log(segDes, "seguro desgravamen");
      amort_aux = -saldo_inicial/(total_cuotas - nc +1)
      console.log(amort_aux, "amortización")
      this.amortizacion.push(parseFloat(amort_aux.toFixed(2)));
      segRisk = -segRies;
      cuota_aux = interes + amort_aux + segDes;
      console.log(cuota_aux, "cuota");
      this.cuotas.push(parseFloat(cuota_aux.toFixed(2)));
      saldo_final = saldo_inicial + amort_aux;
      flujo = cuota_aux + segRisk + segDes;
    }
  }

  american_method(precio_venta_activo: number, cuota_inicial: number,
                n_anios: number, tea: number): void {
    // Clear arrays
    this.cuotas = [];
    this.amortizacion = [];

    // Required calculations
    let numero_cuotas_anio = this.n_dias_anio / this.frecuencia_de_pago;
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
    console.log(flujo)
    for (let nc = 1; nc <= total_cuotas; nc++) {
      flujos.push(flujo);
      tep = Math.pow(1 + tea, this.frecuencia_de_pago / this.n_dias_anio) - 1;
      if (nc == 1) {
        saldo_inicial = saldo_financiar;
      } else {
        saldo_inicial = saldo_final;
      }
      console.log(saldo_inicial, "saldo inicial")
      interes = -saldo_inicial * tep;
      console.log(interes, "interes")
      segDes = -saldo_inicial * this.tasa_desgravamen;
      console.log(segDes, "seguro desgravamen");
      if(nc == total_cuotas){
        amort_aux = -saldo_inicial;
        console.log(amort_aux, "amortización");
      }
      else{
        amort_aux = 0;
      }
      this.amortizacion.push(parseFloat(amort_aux.toFixed(2)));
      segRisk = -segRies;
      cuota_aux = interes + amort_aux + segDes;
      console.log(cuota_aux, "cuota");
      this.cuotas.push(parseFloat(cuota_aux.toFixed(2)));
      saldo_final = saldo_inicial + amort_aux;
      flujo = cuota_aux + segRisk + segDes;
    }
  }

  peruvian_method(precio_venta_activo: number, cuota_inicial: number,
                n_anios: number, tea: number): void {
    // Clear arrays
    this.cuotas = [];
    this.amortizacion = [];

    // Required calculations
    let numero_cuotas_anio = this.n_dias_anio / this.frecuencia_de_pago;
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
    console.log(flujo)
    for (let nc = 1; nc <= total_cuotas; nc++) {
      flujos.push(flujo);
      tep = Math.pow(1 + tea, this.frecuencia_de_pago / this.n_dias_anio) - 1;
      if (nc == 1) {
        saldo_inicial = saldo_financiar;
      } else {
        saldo_inicial = saldo_final;
      }
      console.log(saldo_inicial, "saldo inicial")
      interes = -saldo_inicial * tep;
      console.log(interes, "interes")
      segDes = -saldo_inicial * this.tasa_desgravamen;
      console.log(segDes, "seguro desgravamen");
      if(nc == total_cuotas){
        amort_aux = -saldo_inicial;
        console.log(amort_aux, "amortización");
      }
      else{
        amort_aux = 0;
      }
      this.amortizacion.push(parseFloat(amort_aux.toFixed(2)));
      segRisk = -segRies;
      cuota_aux = interes + amort_aux + segDes;
      console.log(cuota_aux, "cuota");
      this.cuotas.push(parseFloat(cuota_aux.toFixed(2)));
      saldo_final = saldo_inicial + amort_aux;
      flujo = cuota_aux + segRisk + segDes;
    }
  }
}
