import {Entity, OneToMany, VirtualColumn, AfterLoad,
Repository} from 'typeorm';
import AgentesDes from 'src/entidades/entidadesDesarrollos/Cuentas/agentes.des.entity';
import RHRel from './rh.agete.rel.entity'; 
import Documento from './DocumentoComision.entity';

@Entity({name: 'Agentes'})
export default class AgenteRH extends AgentesDes{

    @OneToMany(()=>RHRel, rel=>rel.codAdmin)
    dependientes:RHRel[]

    ventas:number;

    ventasATiempo:number;

    ventasFueraTiempo:number;

    docsRep:Repository<Documento>

    static getVentasString(dbName:string, alias:string){
        let toIgnore =''
        if(dbName === process.env.DB_NAME_CDC)toIgnore = '3015'
        if(dbName === process.env.DB_NAME_CMP)toIgnore = '3016'
        let toFind =''
        if(dbName === process.env.DB_NAME_CDC)toFind = '3045'
        if(dbName === process.env.DB_NAME_CMP)toFind = '3038'
        return `SELECT SUM(CIMPORTEABONO)
        FROM ${dbName}.dbo.admDocumentos doc
        LEFT JOIN ${dbName}.dbo.admAsocCargosAbonos asoc
        ON asoc.CIDDOCUMENTOCARGO = doc.CIDDOCUMENTO
        LEFT JOIN ${dbName}.dbo.admDocumentos pago
        ON asoc.CIDDOCUMENTOABONO = pago.CIDDOCUMENTO
        LEFT JOIN ${dbName}.dbo.admClientes cli
        ON doc.CIDCLIENTEPROVEEDOR = cli.CIDCLIENTEPROVEEDOR
        LEFT JOIN ${dbName}.dbo.admAgentes agente
        ON agente.CIDAGENTE = doc.CIDAGENTE
        WHERE agente.CCODIGOAGENTE = ${alias}.Codigo
        AND pago.CFECHA >= :inicio AND pago.CFECHA <= :final
        AND pago.CIDDOCUMENTODE != 5
        AND pago.CIDCONCEPTODOCUMENTO != ${toIgnore}
        AND pago.CCANCELADO = 0
        AND doc.CCANCELADO = 0
        AND (doc.CIDDOCUMENTODE = 4 OR doc.CIDCONCEPTODOCUMENTO = ${toFind})
        AND ${AgenteRH.calculoVencimiento(dbName)}>= :inicio
        `
    }

    static aTiempo(dbName:string, alias:string){
        return `${AgenteRH.getVentasString(dbName, alias)}
        AND pago.CFECHA<=${AgenteRH.calculoVencimiento(dbName)}`
    }

    static fueraTiempo(dbName:string, alias:string){
        return `${AgenteRH.getVentasString(dbName, alias)}
        AND pago.CFECHA>${AgenteRH.calculoVencimiento(dbName)}`
    } 
    static calculoVencimiento(dbName:string,){
        function cadenaVencimientoQuery(){
            return `(origenEntidad.CFECHA + clienteEntidad.CDIASCREDITOCLIENTE)`
        }
        //return `(doc.CFECHA + cli.CDIASCREDITOCLIENTE)`;
        return `(doc.CFECHA + cli.CDIASCREDITOCLIENTE + 3 + (SELECT count(fecha)
        FROM (
            SELECT DATEADD(DAY, number,${cadenaVencimientoQuery()}) AS fecha
            FROM master..spt_values, ${dbName}.dbo.admDocumentos origenEntidad
            LEFT JOIN ${dbName}.dbo.admCLientes clienteEntidad
            ON clienteEntidad.CIDCLIENTEPROVEEDOR = origenEntidad.CIDCLIENTEPROVEEDOR
            WHERE type = 'P'
            AND DATEADD(DAY, number, ${cadenaVencimientoQuery()}) <= (${cadenaVencimientoQuery()} + 3)
            AND origenEntidad.CIDDOCUMENTO = doc.CIDDOCUMENTO
        ) AS fechas_entre_periodos
        WHERE DATEPART(dw, fecha) = 1))`
    }
}

/* 
@VirtualColumn({type: 'float', query(alias) {
        return AgenteRH.getVentasString(process.env.DB_NAME_CDC,alias)
    },})
    ventasCDC:number

    @VirtualColumn({type: 'float',query(alias) {
        return AgenteRH.getVentasString(process.env.DB_NAME_CMP,alias)
    }})
    ventasCMP:number
    
    @VirtualColumn({type: 'float', query(alias) {
        return AgenteRH.aTiempo(process.env.DB_NAME_CDC,alias)
    },})
    ventasATiempoCDC:number

    @VirtualColumn({type: 'float',query(alias) {
        return AgenteRH.aTiempo(process.env.DB_NAME_CMP,alias)
    }})
    ventasATiempoCMP:number
    
    @VirtualColumn({type: 'float', query(alias) {
        return AgenteRH.fueraTiempo(process.env.DB_NAME_CDC,alias)
    },})
    ventasFueraTiempoCDC:number

    @VirtualColumn({type: 'float',query(alias) {
        return AgenteRH.fueraTiempo(process.env.DB_NAME_CMP,alias)
    }})
    ventasFueraTiempoCMP:number

    @AfterLoad()
    async setVentas(){
        if(this.ventasCDC===null)this.ventasCDC=0;
        if(this.ventasCMP===null)this.ventasCMP=0;
        this.ventas = this.ventasCDC + this.ventasCMP;
        if(this.ventasATiempoCDC===null)this.ventasATiempoCDC=0;
        if(this.ventasATiempoCMP===null)this.ventasATiempoCMP=0;
        this.ventasATiempo = this.ventasATiempoCDC + this.ventasATiempoCMP;
        if(this.ventasFueraTiempoCDC===null)this.ventasFueraTiempoCDC=0;
        if(this.ventasFueraTiempoCMP===null)this.ventasFueraTiempoCMP=0;
        this.ventasFueraTiempo = this.ventasFueraTiempoCDC + this.ventasFueraTiempoCMP;
        //const docs = await this.docsRep.createQueryBuilder('doc').getMany()
        //console.log(docs.length);
    }
*/