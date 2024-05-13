import {Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne, VirtualColumn
, AfterLoad} from 'typeorm';
import RegistroComision from './registro.comision.entity';

@Entity({name:'Detalle_Comision'})
export default class DetalleComision{
    @PrimaryGeneratedColumn({name:'Id'})
    id:number;

    @JoinColumn({name:'Id_Registro'})
    @ManyToOne(()=>RegistroComision, reg=>reg.detalles)
    idRegistro:RegistroComision

    @Column({name:'Serie'})
    serie:string

    @Column({name:'Folio'})
    folio:number

    @Column({name:'Vencimiento'})
    vencimientoComision:Date

    @Column('decimal', {name:'Cobranza_Inicial', scale:2, precision:12})
    cobranza:number

    @Column('decimal', {name:'A_Tiempo', scale:2, precision:12})
    aTiempo:number

    @Column('decimal', {name:'Fuera_Tiempo', scale:2, precision:12})
    fueraTiempo:number

    @Column({name:'Grupo'})
    grupo:number

    cobrado:number

    @VirtualColumn({query: (alias)=>DetalleComision.getDataFromDoc('CFECHA',alias)})
    expedicion:Date

    @VirtualColumn({type:'float', query: (alias)=>DetalleComision.getDataFromDoc('CTOTAL',alias)})
    total:number

    @VirtualColumn({query: (alias)=>DetalleComision.getClient(alias)})
    nombre:string

    @AfterLoad()
    setCobrado(){
        if(this.aTiempo===null||this.aTiempo===undefined)this.aTiempo = 0
        if(this.fueraTiempo===null||this.fueraTiempo===undefined)this.fueraTiempo = 0
        this.cobrado = this.aTiempo + this.fueraTiempo;
    }

    private static getDataFromDoc(col:string, alias:string){
        return `
        CASE
            WHEN ${alias}.Serie IN (SELECT [CSERIEPOROMISION]
                    FROM ${process.env.DB_NAME_CDC}.dbo.admConceptos
                    WHERE [CUSAREFERENCIA] = 4
                    AND CIDDOCUMENTODE = 4) THEN
                (SELECT TOP(1) ${col}
                FROM ${process.env.DB_NAME_CDC}.dbo.admDocumentos doc
                WHERE doc.CSERIEDOCUMENTO = ${alias}.Serie
                AND doc.CFOLIO = ${alias}.Folio)
            WHEN ${alias}.Serie IN (SELECT [CSERIEPOROMISION]
                    FROM ${process.env.DB_NAME_CMP}.dbo.admConceptos
                    WHERE [CUSAREFERENCIA] = 4
                    AND CIDDOCUMENTODE = 4) THEN
                (SELECT TOP(1) ${col}
                FROM ${process.env.DB_NAME_CMP}.dbo.admDocumentos doc
                WHERE doc.CSERIEDOCUMENTO = ${alias}.Serie
                AND doc.CFOLIO = ${alias}.Folio)
        END`
    }

    private static getClient(alias:string){
        const columna = `CASE
            WHEN cli.CRFC = 'XAXX010101000'
                THEN cli.CTEXTOEXTRA3
            ELSE cli.CRAZONSOCIAL
        END`
        function join(dbname:'cdc'|'cmp'){
            const db = (()=>{
                if(dbname==='cdc')return process.env.DB_NAME_CDC;
                if(dbname==='cmp')return process.env.DB_NAME_CMP;
            })();
           return `LEFT JOIN ${db}.dbo.admClientes cli
            ON doc.CIDCLIENTEPROVEEDOR = cli.CIDCLIENTEPROVEEDOR`
        }
        return `
        CASE
            WHEN ${alias}.Serie IN (
                SELECT [CSERIEPOROMISION]
                    FROM ${process.env.DB_NAME_CDC}.dbo.admConceptos
                    WHERE [CUSAREFERENCIA] = 4
                    AND CIDDOCUMENTODE = 4
            )THEN (
                SELECT TOP(1) ${columna}
                FROM ${process.env.DB_NAME_CDC}.dbo.admDocumentos doc
                ${join('cdc')}
                WHERE doc.CSERIEDOCUMENTO = ${alias}.Serie
                AND doc.CFOLIO = ${alias}.Folio
            )WHEN ${alias}.Serie IN (
                SELECT [CSERIEPOROMISION]
                    FROM ${process.env.DB_NAME_CMP}.dbo.admConceptos
                    WHERE [CUSAREFERENCIA] = 4
                    AND CIDDOCUMENTODE = 4
            )THEN(
                SELECT TOP(1) ${columna}
                FROM ${process.env.DB_NAME_CMP}.dbo.admDocumentos doc
                ${join('cmp')}
                WHERE doc.CSERIEDOCUMENTO = ${alias}.Serie
                AND doc.CFOLIO = ${alias}.Folio
            )
        END`
    }

}