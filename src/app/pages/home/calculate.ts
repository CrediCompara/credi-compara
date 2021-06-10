import { irr } from 'financial';
import { Finance } from 'financejs'


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
  tea: number = 0.07
  // estatico
  tasa_desgravamen: number = 0.000285
  tasa_seguro_riesgo: number = 0.00028
  comision_envio_estadoDeCuenta: number = 11.0

  cuota_inicial: number = 0
  cuotaMensual: number = 0
  tcea: number = 0

  // calculo de la cuota inicial
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
    tD = tD / 30
    return (((1 + (iD)) ** tD) - 1) * _S
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
      seguroRiesgo = this.calculo_SeguroRiesgo(this.tasa_seguro_riesgo, valor_inmueble)
      prestamo_plazo -= 1
    }
    return cuotas
  }
  // TCEM o TIR
  calcular_TCEM(lista_de_cuotas: number[]) {
    //let finance = new financial();
    let finance = new Finance();
    lista_de_cuotas.unshift(-this.cuota_inicial)
    //return fx.IRR(lista_de_cuotas);
    //console.log(lista_de_cuotas);
    //return irr(lista_de_cuotas);
    //return finance.IRR(lista_de_cuotas)
    return irr(lista_de_cuotas)
  }
  // TCEA
  calcular_TCEA(tcem: number, n_cuotas_por_anho: number) {
    tcem = tcem / 100
    return ((1 + tcem) ** n_cuotas_por_anho) - 1
  }

  mainCalc(tea: number, valor_inmueble: number, prestamo_plazo: number, cuota_inicial_minima: number) {

    // data estatica
    const tasa_desgravamen = 0.000285
    const tasa_seguro_riesgo = 0.00028
    const comision_envio_estadoDeCuenta = 11.0

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
    const desgravamen = this.calculo_Desgravamen(tasa_desgravamen, t, monto_prestamo)
    // Seguro de Riesgo
    const seguroRiesgo = this.calculo_SeguroRiesgo(tasa_seguro_riesgo, valor_inmueble)

    // Capital amortizado
    const capital_amortizado = this.calculo_CapitalAmortizado(saldoDeCapital, parseFloat((tem).toFixed(6)), prestamo_plazo, parseFloat((interes_del_periodo).toFixed(2)))

    // Cuota Mensual
    this.cuotaMensual = this.calculo_CuotaMensual(capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo, comision_envio_estadoDeCuenta)

    // Calculo del Calendario -> Lista de Cuotas
    var fecha_desembolso = new Date()
    var lista_de_cuotas = this.calcular_lista_cuotas(tem, ted, valor_inmueble, fecha_desembolso, prestamo_plazo, saldoDeCapital, capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo, comision_envio_estadoDeCuenta)

    // TCEM o TIR
    var tcem = this.calcular_TCEM(lista_de_cuotas)

    this.tcea = this.calcular_TCEA(tcem, 12)
    console.log("tcea:",this.tcea);

    //return [cuota_inicial, cuotaMensual, tcea]
  }
}
