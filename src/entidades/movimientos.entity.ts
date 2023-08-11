import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({name:'admMovimientos'})
export default class Movimiento{
    @PrimaryColumn({name:'CIDMOVIMIENTO'})
    id:number
    
    @Column({name:'CIDDOCUMENTO'})
    idDocumento:number
    
    @Column({name:'CNUMEROMOVIMIENTO'})
    numero:number
    
    @Column({name:'CIDDOCUMENTODE'})
    idDocumentoModelo:number
    
    @Column({name:'CIDPRODUCTO'})
    idProducto:number
    
    @Column({name:'CIDALMACEN'})
    idAlmace:number
    
    @Column({name:'CUNIDADES'})
    unidades:number
    
    @Column({name:'CUNIDADESNC'})
    unidadesNC:number
    
    @Column({name:'CUNIDADESCAPTURADAS'})
    unidadesCapturadas:number
    
    @Column({name:'CIDUNIDAD'})
    idunidad:number
    
    @Column({name:'CIDUNIDADNC'})
    idUnidadNC:number
    
    @Column({name:'CPRECIO'})
    precio:number
    
    @Column({name:'CPRECIOCAPTURADO'})
    precioCapturado:number
    
    @Column({name:'CCOSTOCAPTURADO'})
    costoCapturado:number
    
    @Column({name:'CCOSTOESPECIFICO'})
    costoEspecifico:number
    
    @Column({name:'CNETO'})
    neto:number
    
    @Column({name:'CIMPUESTO1'})
    impuesto1:number
    
    @Column({name:'CPORCENTAJEIMPUESTO1'})
    porcentajeImpuesto1:number
    
    @Column({name:'CIMPUESTO2'})
    impuesto2:number
    
    @Column({name:'CPORCENTAJEIMPUESTO2'})
    porcentajeImpuesto2:number
    
    @Column({name:'CIMPUESTO3'})
    impuesto3:number
    
    @Column({name:'CPORCENTAJEIMPUESTO3'})
    porcentajeImpuesto3:number
    
    @Column({name:'CRETENCION1'})
    retencion1:number
    
    @Column({name:'CPORCENTAJERETENCION1'})
    porcentajeretencion1:number
    
    @Column({name:'CRETENCION2'})
    retencion2:number
    
    @Column({name:'CPORCENTAJERETENCION2'})
    porcentajeRetencion2:number
    
    @Column({name:'CDESCUENTO1'})
    descuento1:number
    
    @Column({name:'CPORCENTAJEDESCUENTO1'})
    porcentajeDescuento1:number
    
    @Column({name:'CDESCUENTO2'})
    descuento2:number
    
    @Column({name:'CPORCENTAJEDESCUENTO2'})
    porcentajeDescuento2:number
    
    @Column({name:'CDESCUENTO3'})
    descuento3:number
    
    @Column({name:'CPORCENTAJEDESCUENTO3'})
    porcentajeDescuento3:number
    
    @Column({name:'CDESCUENTO4'})
    descuento4:number
    
    @Column({name:'CPORCENTAJEDESCUENTO4'})
    porcentajeDescuento4:number
    
    @Column({name:'CDESCUENTO5'})
    descuento5:number
    
    @Column({name:'CPORCENTAJEDESCUENTO5'})
    porcentajeDescuento5:number
    
    @Column({name:'CTOTAL'})
    privatetotal:number
    
    @Column({name:'CPORCENTAJECOMISION'})
    porcentajeComision:number
    
    @Column({name:'CREFERENCIA'})
    referencia:string
    
    @Column({name:'COBSERVAMOV'})
    observacionMovimiento:string
    
    @Column({name:'CAFECTAEXISTENCIA'})
    afectaExistencia:number
    
    @Column({name:'CAFECTADOSALDOS'})
    afectadoSados:number
    
    @Column({name:'CAFECTADOINVENTARIO'})
    afectadoInventario:number
    
    @Column({name:'CFECHA'})
    fecha:Date
    
    @Column({name:'CMOVTOOCULTO'})
    movimientoOculto:number
    
    @Column({name:'CIDMOVTOOWNER'})
    movimientoDueño:number
    
    @Column({name:'CIDMOVTOORIGEN'})
    idMovimientoOrigen:number
    
    @Column({name:'CUNIDADESPENDIENTES'})
    unidadesPendientes:number
    
    @Column({name:'CUNIDADESNCPENDIENTES'})
    unidadesPendientesNC:number
    
    @Column({name:'CUNIDADESORIGEN'})
    idUnidadesOrigen:number
    
    @Column({name:'CUNIDADESNCORIGEN'})
    unidadeNCOrigen:number
    
    @Column({name:'CTIPOTRASPASO'})
    tipoTraspaso:number
    
    @Column({name:'CIDVALORCLASIFICACION'})
    valorClasificacion:number
    
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
    
    @Column({name:'CTIMESTAMP'})
    timeStamp:Date
    
    @Column({name:'CGTOMOVTO'})
    gasto:number
    
    @Column({name:'CSCMOVTO'})
    segmentocONTABLE:string
    
    @Column({name:'CCOMVENTA'})
    venta:number
    
    @Column({name:'CIDMOVTODESTINO'})
    idMovimientoDestino:number
    
    @Column({name:'CNUMEROCONSOLIDACIONES'})
    consolidaciones:number
    
    @Column({name:'COBJIMPU01'})
    objImp:string;
}