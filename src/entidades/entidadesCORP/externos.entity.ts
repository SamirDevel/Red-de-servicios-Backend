import { Entity, Column, PrimaryColumn, OneToMany, 
    VirtualColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import Documento from "./documentos.entity";
import Agente from "./agentes.entity";
import Domicilio from "./domicilios.entity";
import ClasificacionesValores from "./clasificaciones.valores";

@Entity({name:'admClientes'})
export default class Externo{
    @PrimaryColumn({name:'CIDCLIENTEPROVEEDOR'})
    id:number
    
    @Column({name:'CCODIGOCLIENTE'})
    codigo:string
    
    @Column({name:'CRAZONSOCIAL'})
    razonSocial:string;
    
    @VirtualColumn({query:alias=>`CASE
        WHEN ${alias}.CRFC = 'XAXX010101000'
            THEN ${alias}.CTEXTOEXTRA3
        ELSE ${alias}.CRAZONSOCIAL
    END
    `})
    nombre:string

    @Column({name:'CFECHAALTA'})
    alta:Date
    
    @Column({name:'CRFC'})
    rfc:string
    
    @Column({name:'CCURP'})
    curp:string
    
    @Column({name:'CDENCOMERCIAL'})
    denominacionComercial:string
    
    @Column({name:'CREPLEGAL'})
    represante:string
    
    @Column({name:'CIDMONEDA'})
    idMoneda:number
    
    @Column({name:'CLISTAPRECIOCLIENTE'})
    listaDePrecios:number
    
    @Column({name:'CDESCUENTODOCTO'})
    descuentoPorDocumento:number
    
    @Column({name:'CDESCUENTOMOVTO'})
    descuentoPorMovimiento:number
    
    @Column({name:'CBANVENTACREDITO'})
    ventaDeCredito:number
    
    @ManyToOne(() =>ClasificacionesValores, cla=>cla.externoRuta)
    @JoinColumn({name:'CIDVALORCLASIFCLIENTE1'})
    clasificacionCliente1:ClasificacionesValores
    
    @ManyToOne(() =>ClasificacionesValores, cla=>cla.externoClasificadoCDC)
    @JoinColumn({name:'CIDVALORCLASIFCLIENTE2'})
    clasificacionCliente2:ClasificacionesValores
    
    @Column({name:'CIDVALORCLASIFCLIENTE3'})
    clasificacionCliente3:number
    
    @ManyToOne(() =>ClasificacionesValores, cla=>cla.externoClasificadoCMP)
    @JoinColumn({name:'CIDVALORCLASIFCLIENTE4'})
    clasificacionCliente4:ClasificacionesValores
    
    @Column({name:'CIDVALORCLASIFCLIENTE5'})
    clasificacionCliente5:number
    
    @Column({name:'CIDVALORCLASIFCLIENTE6'})
     clasificacionCliente6:number
    
    @VirtualColumn({
        query:alias=>`SELECT CCODIGOVALORCLASIFICACION 
        FROM admClasificacionesValores
        WHERE admClasificacionesValores.CIDVALORCLASIFICACION =
        (CASE
            WHEN DB_NAME() = '${process.env.DB_NAME_CDC}' THEN ${alias}.CIDVALORCLASIFCLIENTE2
            WHEN DB_NAME() = '${process.env.DB_NAME_CMP}' THEN ${alias}.CIDVALORCLASIFCLIENTE4
        END)`
            
    })
    clasificacionClienteReal:number

    @VirtualColumn({
        query:alias=>`SELECT 
            admClasificacionesValores.CVALORCLASIFICACION
        FROM admClasificacionesValores 
        WHERE admClasificacionesValores.CIDVALORCLASIFICACION = ${alias}.CIDVALORCLASIFCLIENTE1`
            
    })
    ruta:string

    @Column({name:'CTIPOCLIENTE'})
    tipo:number
    
    @Column({name:'CESTATUS'})
    estatus:number
    
    @Column({name:'CFECHABAJA'})
    fechaBaja:Date
    
    @Column({name:'CFECHAULTIMAREVISION'})
    ultimaRevision:Date
    
    @Column({name:'CLIMITECREDITOCLIENTE'})
    limiteCreditoCliente:number
    
    @Column({name:'CDIASCREDITOCLIENTE'})
    diasCreditoCliente:number
    
    @Column({name:'CBANEXCEDERCREDITO'})
    puedeExceder:number
    
    @Column({name:'CDESCUENTOPRONTOPAGO'})
    descuentoProntoPago:number
    
    @Column({name:'CDIASPRONTOPAGO'})
    diasPronoPago:number
    
    @Column({name:'CINTERESMORATORIO'})
    interesMoratorio:number
    
    @Column({name:'CDIAPAGO'})
    diaPago:number
    
    @Column({name:'CDIASREVISION'})
    diasRevision:number
    
    @Column({name:'CMENSAJERIA'})
    mensajeria:string
    
    @Column({name:'CCUENTAMENSAJERIA'})
    cuentaMensajeria:string
    
    @Column({name:'CDIASEMBARQUECLIENTE'})
    diasEmbarqueCliente:number
    
    @Column({name:'CIDALMACEN'})
    idAlmace:number
    
    @OneToOne(()=>Agente, age=>age.cliente)
    @JoinColumn({name:'CIDAGENTEVENTA'})
    idAgenteVenta:number
    
    @Column({name:'CIDAGENTECOBRO'})
    idAgenteCobro:number
    
    @Column({name:'CRESTRICCIONAGENTE'})
    restriccionAgente:number
    
    @Column({name:'CIMPUESTO1'})
    impuestoCliente1:number
    
    @Column({name:'CIMPUESTO2'})
    impuestoCliente2:number
    
    @Column({name:'CIMPUESTO3'})
    impuestoCliente3:number
    
    @Column({name:'CRETENCIONCLIENTE1'})
    retencionCLiente1:number
    
    @Column({name:'CRETENCIONCLIENTE2'})
    retencionCLiente2:number
    
    @Column({name:'CIDVALORCLASIFPROVEEDOR1'})
    clasificacionProveedor1:number
    
    @Column({name:'CIDVALORCLASIFPROVEEDOR2'})
    clasificacionProveedor2:number
    
    @Column({name:'CIDVALORCLASIFPROVEEDOR3'})
    clasificacionProveedor3:number
    
    @Column({name:'CIDVALORCLASIFPROVEEDOR4'})
    clasificacionProveedor4:number
    
    @Column({name:'CIDVALORCLASIFPROVEEDOR5'})
    clasificacionProveedor5:number
    
    @Column({name:'CIDVALORCLASIFPROVEEDOR6'})
    clasificacionProveedor6:number
    
    @Column({name:'CLIMITECREDITOPROVEEDOR'})
    limiteCreditoProveedor:number
    
    @Column({name:'CDIASCREDITOPROVEEDOR'})
    diasCreditoProveedor:number
    
    @Column({name:'CTIEMPOENTREGA'})
    tiempoEntrega:number
    
    @Column({name:'CDIASEMBARQUEPROVEEDOR'})
    diasEmbarqueProveedor:number
    
    @Column({name:'CIMPUESTOPROVEEDOR1'})
    impuestoProveedor1:number
    
    @Column({name:'CIMPUESTOPROVEEDOR2'})
    impuestoProveedor2:number
    
    @Column({name:'CIMPUESTOPROVEEDOR3'})
    impuestoProveedor3:number
    
    @Column({name:'CRETENCIONPROVEEDOR1'})
    retencionProveedor1:number
    
    @Column({name:'CRETENCIONPROVEEDOR2'})
    retencionProveedor2:number
    
    @Column({name:'CBANINTERESMORATORIO'})
    banderaInteresMoratorio:number
    
    @Column({name:'CCOMVENTAEXCEPCLIENTE'})
    comisionVentaCliente:number
    
    @Column({name:'CCOMCOBROEXCEPCLIENTE'})
    comisionCobroCliente:number
    
    @Column({name:'CBANPRODUCTOCONSIGNACION'})
    permiteProductoConsignacion:number
    
    @Column({name:'CSEGCONTCLIENTE1'})
    segmentoContableCliente1:string
    
    @Column({name:'CSEGCONTCLIENTE2'})
    segmentoContableCliente2:string
    
    @Column({name:'CSEGCONTCLIENTE3'})
    segmentoContableCliente3:string
    
    @Column({name:'CSEGCONTCLIENTE4'})
    segmentoContableCliente4:string
    
    @Column({name:'CSEGCONTCLIENTE5'})
    segmentoContableCliente5:string
    
    @Column({name:'CSEGCONTCLIENTE6'})
    segmentoContableCliente6:string
    
    @Column({name:'CSEGCONTCLIENTE7'})
    segmentoContableCliente7:string
    
    @Column({name:'CSEGCONTPROVEEDOR1'})
    segmentoContableProveedor1:string
    
    @Column({name:'CSEGCONTPROVEEDOR2'})
    segmentoContableProveedor2:string
    
    @Column({name:'CSEGCONTPROVEEDOR3'})
    segmentoContableProveedor3:string
    
    @Column({name:'CSEGCONTPROVEEDOR4'})
    segmentoContableProveedor4:string
    
    @Column({name:'CSEGCONTPROVEEDOR5'})
    segmentoContableProveedor5:string
    
    @Column({name:'CSEGCONTPROVEEDOR6'})
    segmentoContableProveedor6:string
    
    @Column({name:'CSEGCONTPROVEEDOR7'})
    segmentoContableProveedor7:string
    
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
    
    @Column({name:'CBANDOMICILIO'})
    banDomicilio:number
    
    @Column({name:'CBANCREDITOYCOBRANZA'})
    banCyC:number
    
    @Column({name:'CBANENVIO'})
    banEnvio:number
    
    @Column({name:'CBANAGENTE'})
    banAgente:number
    
    @Column({name:'CBANIMPUESTO'})
    banImpuesto:number
    
    @Column({name:'CBANPRECIO'})
    banPrecio:number
    
    @Column({name:'CTIMESTAMP'})
    timeStamp:Date
    
    @Column({name:'CFACTERC01'})
    facturaTerceros:number
    
    @Column({name:'CCOMVENTA'})
    comisionVenta:number
    
    @Column({name:'CCOMCOBRO'})
    comisionCobro:number
    
    @Column({name:'CIDMONEDA2'})
    idMoneda2:number
    
    @Column({name:'CEMAIL1'})
    mail1:string
    
    @Column({name:'CEMAIL2'})
    mail2:string
    
    @Column({name:'CEMAIL3'})
    mail3:string
    
    @Column({name:'CTIPOENTRE'})
    tipoEntrega:number
    
    @Column({name:'CCONCTEEMA'})
    concteemail:number
    
    @Column({name:'CFTOADDEND'})
    reservado:number
    
    @Column({name:'CIDCERTCTE'})
    idCertificado:number
    
    @Column({name:'CENCRIPENT'})
    encriptado:number
    
    @Column({name:'CBANCFD'})
    manejaCFD:number
    
    @Column({name:'CTEXTOEXTRA4'})
    txt4:string
    
    @Column({name:'CTEXTOEXTRA5'})
    txt5:string
    
    @Column({name:'CIMPORTEEXTRA5'})
    importeExtra5:number
    
    @Column({name:'CIDADDENDA'})
    idAddenda:number
    
    @Column({name:'CCODPROVCO'})
    codprovco:string
    
    @Column({name:'CENVACUSE'})
    reservado2:number
    
    @Column({name:'CCON1NOM'})
    reservado3:string
    
    @Column({name:'CCON1TEL'})
    reservado4:string
    
    @Column({name:'CQUITABLAN'})
    eliminarEspaciosBlancos:number
    
    @Column({name:'CFMTOENTRE'})
    formatoEntrego:string
    
    @Column({name:'CIDCOMPLEM'})
    idComplemento:number
    
    @Column({name:'CDESGLOSAI2'})
    desglosaI:number
    
    @Column({name:'CLIMDOCTOS'})
    maximosVencidos:number
    
    @Column({name:'CSITIOFTP'})
    direccionFTP:string
    
    @Column({name:'CUSRFTP'})
    usuarioFTP:string
    
    @Column({name:'CMETODOPAG'})
    metodoPago:string
    
    @Column({name:'CNUMCTAPAG'})
    numeroCuenta:string
    
    @Column({name:'CIDCUENTA'})
    idCuenta:string
    
    @Column({name:'CUSOCFDI'})
    usoCFDI:string
    
    @Column({name:'CREGIMFISC'})
    regimenFiscal:string

    @OneToMany(() =>Documento, doc=>doc.idCliente)
    documentos:Documento[]

    @OneToMany(()=>Domicilio, dom=>dom.idCliente)
    domicilios:Domicilio[]
    //@AfterLoad()
    /*setDoms(){
        this.domFiscal = this.domicilios.filter(dom=>dom.tipo==0)
        this.domEntrega = this.domicilios.filter(dom=>dom.tipo==1)
    }*/
}