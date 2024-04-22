import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import Movimiento from "./movimientos.entity";

@Entity({name:'admProductos'})
export default class Producto{
    @PrimaryColumn({name:'CIDPRODUCTO'})
    id:number

    @Column({name:'CCODIGOPRODUCTO'})
    codigo:string

    @Column({name:'CNOMBREPRODUCTO'})
    nombre:string

    @Column({name:'CTIPOPRODUCTO'})
    tipo:number

    @Column({name:'CFECHAALTAPRODUCTO'})
    alta:Date

    @Column({name:'CCONTROLEXISTENCIA'})
    controlExistencia:number

    @Column({name:'CIDFOTOPRODUCTO'})
    idFoto:number

    @Column({name:'CDESCRIPCIONPRODUCTO'})
    descripcion:string

    @Column({name:'CMETODOCOSTEO'})
    metodoCosteo:number

    @Column({name:'CPESOPRODUCTO'})
    peso:number

    @Column({name:'CCOMVENTAEXCEPPRODUCTO'})
    ccomventaexcepproducto:number

    @Column({name:'CCOMCOBROEXCEPPRODUCTO'})
    ccomcobroexcepproducto:number

    @Column({name:'CCOSTOESTANDAR'})
    costoEstandar:number

    @Column({name:'CMARGENUTILIDAD'})
    mergenUtilidad:number

    @Column({name:'CSTATUSPRODUCTO'})
    estatus:number

    @Column({name:'CIDUNIDADBASE'})
    unidadesBase:number

    @Column({name:'CIDUNIDADNOCONVERTIBLE'})
    idUnidadNoConvertible:number

    @Column({name:'CFECHABAJA'})
    baja:Date

    @Column({name:'CIMPUESTO1'})
    impuesto1:number

    @Column({name:'CIMPUESTO2'})
    impuesto2:number

    @Column({name:'CIMPUESTO3'})
    impuesto3:number

    @Column({name:'CRETENCION1'})
    retencion1:number

    @Column({name:'CRETENCION2'})
    retencion2:number

    @Column({name:'CIDPADRECARACTERISTICA1'})
    idPadreCaracteristica1:number

    @Column({name:'CIDPADRECARACTERISTICA2'})
    idPadreCaracteristica2:number

    @Column({name:'CIDPADRECARACTERISTICA3'})
    idPadreCaracteristica3:number

    @Column({name:'CIDVALORCLASIFICACION1'})
    calsificacion1:number

    @Column({name:'CIDVALORCLASIFICACION2'})
    calsificacion2:number

    @Column({name:'CIDVALORCLASIFICACION3'})
    calsificacion3:number

    @Column({name:'CIDVALORCLASIFICACION4'})
    calsificacion4:number

    @Column({name:'CIDVALORCLASIFICACION5'})
    calsificacion5:number

    @Column({name:'CIDVALORCLASIFICACION6'})
    calsificacion6:number

    @Column({name:'CSEGCONTPRODUCTO1'})
    segmentoContable1:number

    @Column({name:'CSEGCONTPRODUCTO2'})
    segmentoContable2:number

    @Column({name:'CSEGCONTPRODUCTO3'})
    segmentoContable3:number

    @Column({name:'CTEXTOEXTRA1'})
    txt1:string

    @Column({name:'CTEXTOEXTRA2'})
    txt2:string

    @Column({name:'CTEXTOEXTRA3'})
    txt3:string

    @Column({name:'CFECHAEXTRA'})
    fechaExtra:Date

    @Column({name:'CIMPORTEEXTRA1'})
    importeExtra1:number

    @Column({name:'CIMPORTEEXTRA2'})
    importeExtra2:number

    @Column({name:'CIMPORTEEXTRA3'})
    importeExtra3:number

    @Column({name:'CIMPORTEEXTRA4'})
    importeExtra4:number

    @Column({name:'CPRECIO1'})
    precio1:number

    @Column({name:'CPRECIO2'})
    precio2:number

    @Column({name:'CPRECIO3'})
    precio3:number

    @Column({name:'CPRECIO4'})
    precio4:number

    @Column({name:'CPRECIO5'})
    precio5:number

    @Column({name:'CPRECIO6'})
    precio6:number

    @Column({name:'CPRECIO7'})
    precio7:number

    @Column({name:'CPRECIO8'})
    precio8:number

    @Column({name:'CPRECIO9'})
    precio9:number

    @Column({name:'CPRECIO10'})
    precio10:number

    @Column({name:'CBANUNIDADES'})
    banderaUnidades:number

    @Column({name:'CBANCARACTERISTICAS'})
    banderaCaracteriticas:number

    @Column({name:'CBANMETODOCOSTEO'})
    banderaMetodoCosteo:number

    @Column({name:'CBANMAXMIN'})
    banderaMaximoMinimo:number

    @Column({name:'CBANPRECIO'})
    banderaPrecio:number

    @Column({name:'CBANIMPUESTO'})
    bnderaImpuesto:number

    @Column({name:'CBANCODIGOBARRA'})
    banderaCodigoBarra:number

    @Column({name:'CBANCOMPONENTE'})
    banderaComponente:number

    @Column({name:'CTIMESTAMP'})
    timeStamp:Date

    @Column({name:'CERRORCOSTO'})
    errorCosto:number

    @Column({name:'CFECHAERRORCOSTO'})
    fechaErrorCosto:Date

    @Column({name:'CPRECIOCALCULADO'})
    PrecioCalculado:number

    @Column({name:'CESTADOPRECIO'})
    estadoPrecio:number

    @Column({name:'CBANUBICACION'})
    BanderaUbicacion:number

    @Column({name:'CESEXENTO'})
    excento:number

    @Column({name:'CEXISTENCIANEGATIVA'})
    existenciaNegativa:number

    @Column({name:'CCOSTOEXT1'})
    costoExtra1:number

    @Column({name:'CCOSTOEXT2'})
    costoExtra2:number

    @Column({name:'CCOSTOEXT3'})
    costoExtra3:number

    @Column({name:'CCOSTOEXT4'})
    costoExtra4:number

    @Column({name:'CCOSTOEXT5'})
    costoExtra5:number

    @Column({name:'CFECCOSEX1'})
    fechaCostoExtra1:Date

    @Column({name:'CFECCOSEX2'})
    fechaCostoExtra2:Date

    @Column({name:'CFECCOSEX3'})
    fechaCostoExtra3:Date

    @Column({name:'CFECCOSEX4'})
    fechaCostoExtra4:Date

    @Column({name:'CFECCOSEX5'})
    fechaCostoExtra5:Date

    @Column({name:'CMONCOSEX1'})
    moncosex1:number

    @Column({name:'CMONCOSEX2'})
    moncosex2:number

    @Column({name:'CMONCOSEX3'})
    moncosex3:number

    @Column({name:'CMONCOSEX4'})
    moncosex4:number

    @Column({name:'CMONCOSEX5'})
    moncosex5:number

    @Column({name:'CBANCOSEX'})
    bancosex:number

    @Column({name:'CESCUOTAI2'})
    esCotaI2:number

    @Column({name:'CESCUOTAI3'})
    esCotaI3:number

    @Column({name:'CIDUNIDADCOMPRA'})
    idUnidadCompra:number

    @Column({name:'CIDUNIDADVENTA'})
    unidadVenta:number

    @Column({name:'CSUBTIPO'})
    subtipo:number

    @Column({name:'CCODALTERN'})
    codigoAlterno:string

    @Column({name:'CNOMALTERN'})
    nombreAlterno:string

    @Column({name:'CDESCCORTA'})
    cdescorta:string

    @Column({name:'CIDMONEDA'})
    idMoneda:number

    @Column({name:'CUSABASCU'})
    usaBascu:number

    @Column({name:'CTIPOPAQUE'})
    tipoPaquete:number

    @Column({name:'CPRECSELEC'})
    preselect:number

    @Column({name:'CDESGLOSAI2'})
    desglosaI2:number

    @Column({name:'CSEGCONTPRODUCTO4'})
    segmentoContable4:number

    @Column({name:'CSEGCONTPRODUCTO5'})
    segmentoContable5:number

    @Column({name:'CSEGCONTPRODUCTO6'})
    segmentoContable6:number

    @Column({name:'CSEGCONTPRODUCTO7'})
    segmentoContable7:number

    @Column({name:'CCTAPRED'})
    tapred:string

    @Column({name:'CNODESCOMP'})
    nodescomp:number

    @Column({name:'CIDUNIXML'})
    iduniXML:number

    @Column({name:'CCLAVESAT'})
    claveSat:string

    @Column({name:'CCANTIDADFISCAL'})
    cantidadFiscal:string

    @OneToMany(()=> Movimiento, mov=>mov.idProducto)
    movimientos:Movimiento[]
}