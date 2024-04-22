import { Entity,  VirtualColumn, AfterLoad,
ManyToOne, JoinColumn} from "typeorm";
import Documento from "src/entidades/entidadesCORP/documentos.entity";
import AgenteRH from "./rh.agente.entity";
import { Repository} from 'typeorm';
import * as fns from '../../../estructuras_y_algoritmos/funciones'

@Entity({name:'admDocumentos'})
export default class DocumentoComision extends Documento{
    @VirtualColumn({query: (alias)=>`CONVERT(date, ${alias}.CFECHA, 120)`})
    vencimientoComision:Date

    @VirtualColumn({query: (alias)=>{
        return `SELECT domingos FROM(${DocumentoComision.cadenaDiasInhabiles(alias)}) doms`
    }})
    diasInhabiles:number

    @VirtualColumn('decimal', {query: (alias)=>{
        return DocumentoComision.cadenaPendienteInicio(alias);
    }})
    pendienteInicio:number

    @VirtualColumn('decimal', {query: (alias)=>{
        return DocumentoComision.cadenaDeudaInicio(alias);
    }})
    deudaInicio:number
    
    @VirtualColumn('decimal', {query: (alias)=>{
        return DocumentoComision.cadenaPagado(alias, `(${DocumentoComision.cadenaPagoEnPeriodo()})
            AND pagoEntidad.CIDDOCUMENTODE = 5
           AND ${DocumentoComision.cadenaVencimientoComisionQuery()} < :fechaI
        `)

    }})
    deudaCancelada:number
    
    @VirtualColumn('decimal', {query: (alias)=>{
        return DocumentoComision.cadenaPagado(alias, `${DocumentoComision.cadenaPagoEnPeriodoExcluye()}
           AND ${DocumentoComision.cadenaVencimientoComisionQuery()} < :fechaI
        `)

    }})
    deudaRecuperada:number

    @VirtualColumn('decimal', {query: (alias)=>{
        return DocumentoComision.cadenaPagado(alias, `${DocumentoComision.cadenaPagoEnPeriodoExcluye()}
           AND ${DocumentoComision.cadenaVencimientoComisionQuery()} >= :fechaI
        `)

    }})
    cobrado:number

    @VirtualColumn('decimal', {query: (alias)=>{
        return DocumentoComision.cadenaPagado(alias, `${DocumentoComision.cadenaPagoEnPeriodoExcluye()}
        AND CONVERT(date, ${DocumentoComision.cadenaVencimientoComisionQuery()}) > CONVERT(date, :fechaF)`);
    }})
    adelantado:number

    @VirtualColumn('decimal', {query: (alias)=>{
        return DocumentoComision.cadenaPagado(alias, `${DocumentoComision.cadenaPagoEnPeriodoExcluye()}
        AND pagoEntidad.CFECHA<= ${DocumentoComision.cadenaVencimientoComisionQuery()}`)
    }})
    aTiempo:number

    @VirtualColumn('decimal', {query: (alias)=>{
        return DocumentoComision.cadenaPagado(alias, `${DocumentoComision.cadenaPagoEnPeriodoExcluye()}
        AND pagoEntidad.CFECHA > ${DocumentoComision.cadenaVencimientoComisionQuery()}`)
    }})
    fueraTiempo:number

    @VirtualColumn('decimal', {query: (alias)=>{
        return `ROUND(${alias}.CTOTAL - (${DocumentoComision.cadenaPagado(alias,`(CONVERT(date, pagoEntidad.CFECHA) <= CONVERT(date, :fechaF)
            AND pagoEntidad.CCANCELADO = 0 )`)}), 2) `
    }})
    pendienteFinal:number

    @AfterLoad()
    calcularVencimientoComision(){
        //console.log(this.vencimientoComision);
        if(this.diasInhabiles === null)this.diasInhabiles = 0;
        this.vencimientoReal.setDate(this.vencimientoReal.getDate() + 3 + this.diasInhabiles);
        //this.pendienteInicio = fns.fixed(this.pendienteInicio)  
        //this.pendienteFinal = fns.fixed(this.pendienteFinal)  
    }
    //@AfterLoad()
    async calcularPagos(repo:Repository<DocumentoComision>){
        const query = repo.createQueryBuilder('pag')
            .addSelect('pag.aTiempo')
            .addSelect('pag.fueraTiempo')
            .addSelect('pag.adelantado')
            .where(`pag.id = ${this.id}`)
            .setParameters({vencimientoComision:this.vencimientoComision})
        //console.log(this);
        //console.log(query.getQuery());
        const result = await query.getOne();
        this.aTiempo = result.aTiempo;
        this.fueraTiempo = result.fueraTiempo;
        this.adelantado = result.adelantado;
        console.log(this);
    }

    //static
    static cadenaVencimientoQuery(){
        return `(origenEntidad.CFECHA + clienteEntidad.CDIASCREDITOCLIENTE)`
    }
    static cadenaDiasInhabiles(alias:string){
        return `SELECT COALESCE(count(fecha), 0) AS domingos
        ,IDDOC
        FROM (
            SELECT DATEADD(DAY, number, ${DocumentoComision.cadenaVencimientoQuery()}) AS fecha
            ,origenEntidad.CIDDOCUMENTO AS IDDOC
            FROM master..spt_values, admDocumentos origenEntidad
            LEFT JOIN admCLientes clienteEntidad
            ON clienteEntidad.CIDCLIENTEPROVEEDOR = origenEntidad.CIDCLIENTEPROVEEDOR
            WHERE type = 'P'
            AND DATEADD(DAY, number, ${DocumentoComision.cadenaVencimientoQuery()}) <= (${DocumentoComision.cadenaVencimientoQuery()} + 3)
            AND origenEntidad.CIDDOCUMENTO = ${alias}.CIDDOCUMENTO
        ) AS fechas_entre_periodos
        WHERE DATEPART(dw, fecha) = 1
        OR DATEPART(dw, fecha) = 7
        GROUP BY IDDOC`
    }
    
    static cadenaVencimientoComisionQuery(){
        return `(${DocumentoComision.cadenaVencimientoQuery()} + 3 + (CASE 
            WHEN sb.domingos IS NOT NULL THEN sb.domingos
            ELSE 0
        END))`
    }
    static cadenaPendienteInicio(alias:string){
        return `${alias}.CTOTAL - (${DocumentoComision.cadenaPagado(alias,`(pagoEntidad.CFECHA < :fechaI 
            AND pagoEntidad.CCANCELADO = 0 )
            OR ((pagoEntidad.CIDDOCUMENTODE = 5 OR pagoEntidad.CIDCONCEPTODOCUMENTO = :pagoConcepto )
                AND ${DocumentoComision.cadenaPagoEnPeriodo()} AND pagoEntidad.CCANCELADO = 0)
            `)}) `
    }
    static cadenaDeudaInicio(alias:string){
        return `${alias}.CTOTAL - (${DocumentoComision.cadenaPagado(alias,`(pagoEntidad.CFECHA < :fechaI 
            AND pagoEntidad.CCANCELADO = 0 )
            `)}) `
    }
    static cadenaPagado(alias:string, when:string){
        return `SELECT ROUND(COALESCE(SUM(
            CASE 
                WHEN ${when} THEN asocEntidad.CIMPORTEABONO
                ELSE 0
        END),0),2) FROM admAsocCargosAbonos asocEntidad
        LEFT JOIN admDocumentos pagoEntidad
        ON pagoEntidad.CIDDOCUMENTO = asocEntidad.CIDDOCUMENTOABONO
        LEFT JOIN admDocumentos origenEntidad
        ON origenEntidad.CIDDOCUMENTO = asocEntidad.CIDDOCUMENTOCARGO
        LEFT JOIN admCLientes clienteEntidad
        ON clienteEntidad.CIDCLIENTEPROVEEDOR = origenEntidad.CIDCLIENTEPROVEEDOR
        LEFT JOIN (
            ${DocumentoComision.cadenaDiasInhabiles(alias)}
        ) sb ON asocEntidad.CIDDOCUMENTOCARGO = sb.IDDOC
        WHERE asocEntidad.CIDDOCUMENTOCARGO = ${alias}.CIDDOCUMENTO`
    }
    static cadenaPagoEnPeriodo(){
        return `pagoEntidad.CFECHA >= :fechaI
        AND pagoEntidad.CFECHA <= :fechaF`

    }
    static cadenaPagoEnPeriodoExcluye(){
        return `${DocumentoComision.cadenaPagoEnPeriodo()}
        AND pagoEntidad.CIDDOCUMENTODE != 5
        AND pagoEntidad.CIDCONCEPTODOCUMENTO != :pagoConcepto`
    }
}

/*
static cadenaPendienteInicio(alias:string){
        return `${alias}.CTOTAL - (${DocumentoComision.cadenaPagado(alias,`(pagoEntidad.CFECHA < :fechaI 
            AND pagoEntidad.CCANCELADO = 0 )
            OR ((pagoEntidad.CIDDOCUMENTODE = 5 OR pagoEntidad.CIDCONCEPTODOCUMENTO = :pagoConcepto )
                AND ${DocumentoComision.cadenaPagoEnPeriodo()} AND pagoEntidad.CCANCELADO = 0)
            `)}) `
    }
*/