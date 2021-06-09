
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
  const tea = 0.07
  // estatico
  const tasa_desgravamen = 0.000285
  const tasa_seguro_riesgo = 0.00028
  const comision_envio_estadoDeCuenta = 11.0

  // calculo de la cuota inicial
  function calculo_CuotaInicial(vBien: number, ci_porcentaje: number) {
    return vBien * ci_porcentaje
  }
  // Calculo del monto del prestamo
  function calculo_MontoDelPrestamo(vBien: number, ci: number) {
    return vBien - ci
  }
  // TEM
  function calculo_TEM(i: number) {
    return ((1 + i) ** (1 / 12)) - 1
  }
  // TED
  function calculo_TED(im: number) {
    return ((1 + im) ** (1 / 30)) - 1
  }
  // Interes del Periodo
  function calculo_InteresPeriodo(id: number, t: number, _S: number) {
    return (((1 + id) ** t) - 1) * _S
  }
  // calculo desgravamen
  function calculo_Desgravamen(iD: number, tD: number, _S: number) {
    tD = tD / 30
    return (((1 + (iD)) ** tD) - 1) * _S
  }
  // calculo seguro de riesgo
  function calculo_SeguroRiesgo(iB: number, vBien: number) {
    return iB * vBien
  }
  // capital amortizado
  function calculo_CapitalAmortizado(
    monto_a_financiar: number,
    tem: number,
    prestamo_plazo: number,
    interes: number) {
    console.log(monto_a_financiar, tem, prestamo_plazo, interes)
    return ((monto_a_financiar * tem) / (1 - ((1 + tem) ** (-prestamo_plazo)))) - interes
  }
  // cuota mensual
  function calculo_CuotaMensual(
    capital_amortizado: number,
    interes_del_periodo: number,
    desgravamen: number,
    seguroRiesgo: number,
    comision_envio_estadoDeCuenta: number) {
    return (capital_amortizado + interes_del_periodo + desgravamen + seguroRiesgo + comision_envio_estadoDeCuenta)
  }
  // Calculo del calendario -> lista de cuotas
  function calcular_lista_cuotas(tem: number, ted: number, valor_inmueble: number, fecha_desembolso: Date, prestamo_plazo: number, saldoDeCapital: number, capital_amortizado: number,
    interes_del_periodo: number, desgravamen: number, seguroRiesgo: number, comision_envio_estadoDeCuenta: number) {

    var cuotas = []
    var fechas_de_pago = []
    fecha_desembolso.setDate(fecha_desembolso.getDate() + 30)
    var fecha_de_pago = fecha_desembolso
    while (prestamo_plazo > 0) {

      var cuotaMensual = calculo_CuotaMensual(capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo,
        comision_envio_estadoDeCuenta)
      //console.log(fecha_de_pago, prestamo_plazo, saldoDeCapital, capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo, comision_envio_estadoDeCuenta, cuotaMensual)

      cuotas.push(cuotaMensual)
      fechas_de_pago.push(fecha_de_pago)
      // actualizar
      fecha_de_pago.setDate(fecha_de_pago.getDate() + 30)
      saldoDeCapital -= capital_amortizado
      capital_amortizado = calculo_CapitalAmortizado(saldoDeCapital, tem, prestamo_plazo, interes_del_periodo)
      interes_del_periodo = calculo_InteresPeriodo(ted, 30, saldoDeCapital)
      desgravamen = calculo_Desgravamen(tasa_desgravamen, 30, saldoDeCapital)
      seguroRiesgo = calculo_SeguroRiesgo(tasa_seguro_riesgo, valor_inmueble)
      prestamo_plazo -= 1
    }
    return cuotas
  }
  // TCEM o TIR
  function calcular_TCEM(cuota_inicial: number, lista_de_cuotas: number[]) {
    //var Finance = require('financejs');
    //var fx = new Finance();
    lista_de_cuotas.unshift(-cuota_inicial)
    //return fx.IRR(lista_de_cuotas)
  }
  // TCEA
  function calcular_TCEA(tcem: number, n_cuotas_por_anho: number) {
    tcem = tcem / 100
    return ((1 + tcem) ** n_cuotas_por_anho) - 1
  }

  function mainCalc(tea: number, valor_inmueble: number, prestamo_plazo: number, ingreso_mensual: number, cuota_inicial_minima: number) {

    // data estatica
    const tasa_desgravamen = 0.000285
    const tasa_seguro_riesgo = 0.00028
    const comision_envio_estadoDeCuenta = 11.0

    // Monto a Financiar
    // Cuota Inicial y Monto del Prestamo
    const cuota_inicial = calculo_CuotaInicial(valor_inmueble, cuota_inicial_minima)
    const monto_prestamo = calculo_MontoDelPrestamo(valor_inmueble, cuota_inicial)

    // getRates(ingreso_mensual)

    // Interes
    var t = 30 // diferencia dias entre fecha de desembolso y primera cuota
    var saldoDeCapital = valor_inmueble - cuota_inicial
    const tem = calculo_TEM(tea)
    const ted = calculo_TED(tem)
    const interes_del_periodo = calculo_InteresPeriodo(ted, t, monto_prestamo)

    // Seguro de Desgravamen
    const desgravamen = calculo_Desgravamen(tasa_desgravamen, t, monto_prestamo)
    // Seguro de Riesgo
    const seguroRiesgo = calculo_SeguroRiesgo(tasa_seguro_riesgo, valor_inmueble)

    // Capital amortizado
    const capital_amortizado = calculo_CapitalAmortizado(saldoDeCapital, parseFloat((tem).toFixed(6)), prestamo_plazo, parseFloat((interes_del_periodo).toFixed(2)))

    // Cuota Mensual
    var cuotaMensual = calculo_CuotaMensual(capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo, comision_envio_estadoDeCuenta)
    console.log(cuotaMensual)

    // Calculo del Calendario -> Lista de Cuotas
    var fecha_desembolso = new Date()
    var lista_de_cuotas = calcular_lista_cuotas(tem, ted, valor_inmueble, fecha_desembolso, prestamo_plazo, saldoDeCapital, capital_amortizado, interes_del_periodo, desgravamen, seguroRiesgo, comision_envio_estadoDeCuenta)

    // TCEM o TIR
    //var tcem = calcular_TCEM(cuota_inicial, lista_de_cuotas)
    var tcem = 0.64

    var tcea = calcular_TCEA(tcem, 12)
    console.log(tcea)

    return {
      cuota_inicial,
      cuotaMensual,
      tcea
    }
  }

//mainCalc(valor_inmueble, prestamo_plazo, ingreso_mensual, cuota_inicial_minima_porcentaje)

export { mainCalc }
