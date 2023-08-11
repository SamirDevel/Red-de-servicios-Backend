import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, VirtualColumn } from "typeorm";
import Externos from "./externos.entity";

@Entity({name:'admDocumentos'})
export default class Documento{
    @PrimaryColumn({name:'CIDDOCUMENTO'})
    id:number
    
    @Column({name:'CIDDOCUMENTODE'})
    idModelo:number
    
    @Column({name:'CIDCONCEPTODOCUMENTO'})
    idConcepto:number
    
    @Column({name:'CSERIEDOCUMENTO'})
    serie:string;

    @Column({name:'CFOLIO'})
    folio:number
    
    @Column({name:'CFECHA'})
    expedicion:Date
    
    @VirtualColumn({query: (alias)=>`CFECHA + (SELECT admClientes.[CDIASCREDITOCLIENTE]
     FROM admClientes
     WHERE admCLientes.CIDCLIENTEPROVEEDOR = ${alias}.CIDCLIENTEPROVEEDOR)`
    })
    vencimientoReal:Date

    @ManyToOne(() =>Externos, (externo)=>externo.documentos)
    @JoinColumn({name:'CIDCLIENTEPROVEEDOR'})
    idCliente:number

    @Column({name:'CRAZONSOCIAL'})
    razonSocial:string
    
    @Column({name:'CRFC'})
    rfc:string
    
    @Column({name:'CIDAGENTE'})
    idAgente:number
    
    @Column({name:'CFECHAVENCIMIENTO'})
    vencimiento:Date
    
    @Column({name:'CFECHAPRONTOPAGO'})
    prontoPago:Date
    
    @Column({name:'CFECHAENTREGARECEPCION'})
    recepcion:Date
    
    @Column({name:'CFECHAULTIMOINTERES'})
    ultimoInteres:Date
    
    @Column({name:'CIDMONEDA'})
    idMoneda:number
    
    @Column({name:'CTIPOCAMBIO'})
    tipoCambio:number;
    
    @Column({name:'CREFERENCIA'})
    referencia:string
    
    @Column({name:'COBSERVACIONES'})
    observaciones:string
    
    @Column({name:'CNATURALEZA'})
    naturaleza:number
    
    @Column({name:'CIDDOCUMENTOORIGEN'})
    origen:number
    
    @Column({name:'CPLANTILLA'})
    plantilla:number
    
    @Column({name:'CUSACLIENTE'})
    usaCliente:number
    
    @Column({name:'CUSAPROVEEDOR'})
    usaProveedor:number
    
    @Column({name:'CAFECTADO'})
    afectado:number
    
    @Column({name:'CIMPRESO'})
    impreso:number
    
    @Column({name:'CCANCELADO'})
    cancelado:number
    
    @Column({name:'CDEVUELTO'})
    devuelto:number
    
    @Column({name:'CIDPREPOLIZA'})
    idPrepoliza:number
    
    @Column({name:'CIDPREPOLIZACANCELACION'})
    idPrepolizaCancelacion:number
    
    @Column({name:'CESTADOCONTABLE'})
    estadoContable:number;
    
    @Column({name:'CNETO'})
    neto:number
    
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
    
    @Column({name:'CDESCUENTOMOV'})
    descuentoMov:number
    
    @Column({name:'CDESCUENTODOC1'})
    descuentoDoc1:number
    
    @Column({name:'CDESCUENTODOC2'})
    descuentoDoc2:number
    
    @Column({name:'CGASTO1'})
    gasto1:number
    
    @Column({name:'CGASTO2'})
    gasto2:number
    
    @Column({name:'CGASTO3'})
    gasto3:number
    
    @Column({name:'CTOTAL'})
    total:number

    @Column({name:'CPENDIENTE'})
    pendiente:number
    
    @VirtualColumn({
        query: alias=>`CASE
            WHEN CPENDIENTE > 0
                THEN (DATEDIFF(DAY,GETDATE(),([CFECHA] + 
                    (SELECT admClientes.[CDIASCREDITOCLIENTE] FROM admClientes WHERE admClientes.CIDCLIENTEPROVEEDOR = ${alias}.CIDCLIENTEPROVEEDOR)
                     + 5)))
            ELSE 0
        END`
    })
    atraso:number

    @Column({name:'CTOTALUNIDADES'})
    unidades:number
    
    @Column({name:'CDESCUENTOPRONTOPAGO'})
    descuentoProntoPago:number
    
    @Column({name:'CPORCENTAJEIMPUESTO1'})
    porcentajeImpuesto1:number
    
    @Column({name:'CPORCENTAJEIMPUESTO2'})
    porcentajeImpuesto2:number
    
    @Column({name:'CPORCENTAJEIMPUESTO3'})
    porcentajeImpuesto3:number
    
    @Column({name:'CPORCENTAJERETENCION1'})
    porcentajeRetencion1:number
    
    @Column({name:'CPORCENTAJERETENCION2'})
    porcentajeRetencion2:number
    
    @Column({name:'CPORCENTAJEINTERES'})
    porcentajeInteres:number
    
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
    
    @Column({name:'CDESTINATARIO'})
    destinatario:string
    
    @Column({name:'CNUMEROGUIA'})
    numeroGuia:string
    
    @Column({name:'CMENSAJERIA'})
    mensajeria:string
    
    @Column({name:'CCUENTAMENSAJERIA'})
    cuentaMensajeria:string
    
    @Column({name:'CNUMEROCAJAS'})
    cajas:number
    
    @Column({name:'CPESO'})
    peso:number
    
    @Column({name:'CBANOBSERVACIONES'})
    banObservaciones:number;
    
    @Column({name:'CBANDATOSENVIO'})
    banDatosEnvio:number
    
    @Column({name:'CBANCONDICIONESCREDITO'})
    banCondicionesCredito:number
    
    @Column({name:'CBANGASTOS'})
    gastos:number
    
    @Column({name:'CUNIDADESPENDIENTES'})
    unidadesPendientes:number
    
    @Column({name:'CTIMESTAMP'})
    timeStamp:Date
    
    @Column({name:'CIMPCHEQPAQ'})
    impCheq:number
    
    @Column({name:'CSISTORIG'})
    sistemaOrigen:number
    
    @Column({name:'CIDMONEDCA'})
    idMonedaCambio:number
    
    @Column({name:'CTIPOCAMCA'})
    tipoCambioCa:number
    
    @Column({name:'CESCFD'})
    esFD:number;
    
    @Column({name:'CTIENECFD'})
    tieneFD:number
    
    @Column({name:'CLUGAREXPE'})
    lugarExpedicion:string
    
    @Column({name:'CMETODOPAG'})
    metodoPag:string
    
    @Column({name:'CNUMPARCIA'})
    parciaidades:number
    
    @Column({name:'CCANTPARCI'})
    cantidadParcialidades:number
    
    @Column({name:'CCONDIPAGO'})
    condicionesPago:string
    
    @Column({name:'CNUMCTAPAG'})
    numeroCuenta:string
    
    @Column({name:'CGUIDDOCUMENTO'})
    gui:string;
    
    @Column({name:'CUSUARIO'})
    usuario:string
    
    @Column({name:'CIDPROYECTO'})
    idProyecto:number
    
    @Column({name:'CIDCUENTA'})
    idCuenta:number
    
    @Column({name:'CTRANSACTIONID'})
    transacionId:string
    
    @Column({name:'CIDCOPIADE'})
    cidCopiaDe:number
    
    @Column({name:'CVERESQUE'})
    veresque:string

}