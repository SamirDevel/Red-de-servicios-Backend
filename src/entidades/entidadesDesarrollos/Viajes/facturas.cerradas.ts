import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, AfterLoad,
    VirtualColumn, JoinColumn } from "typeorm";
import { sqlBuilder } from "src/estructuras_y_algoritmos/sql.query.builder";

@Entity({name:'Facturas_Cerradas'})
export default class FacturaCerrada{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @Column({name:'Serie'})
    serie:string;

    @Column({name:'Folio'})
    folio:number;

    @Column({name:'Motivo'})
    motivo:string;

    @Column({name:'Fecha'})
    fecha:Date;

    @VirtualColumn({query(alias){
        //console.log(nombre);
        return FacturaCerrada.getProperty(alias, 'NOMBRE')
    }})
    nombre:string;
    @VirtualColumn({query(alias){
        //console.log(nombre);
        return FacturaCerrada.getProperty(alias, 'CODIGO')
    }})
    codigo:string;
    
    @VirtualColumn({query(alias){
        return FacturaCerrada.getProperty(alias, 'EXPEDICION')
    }})
    expedicion:Date;
    
    @VirtualColumn({query(alias){
        return FacturaCerrada.getProperty(alias, 'TOTAL');
    }})
    total:number;

    static getProperty(alias:string, propiedad:string){
        const sentence = sqlBuilder.TOP([
            propiedad
        ], 1) 
        + sqlBuilder.FROM_QUERY(`${FacturaCerrada.consultaCompaq('cdc')}
        UNION
        ${FacturaCerrada.consultaCompaq('cmp')}`, 'sq')
        + sqlBuilder.WHERE() + sqlBuilder.CONDICION({
            tabla:{
                tabla:'sq',
                columna:'SERIE'
            },
            condicion:'=',
            valor:`${alias}.Serie`
        }) + sqlBuilder.AND() + sqlBuilder.CONDICION({
            tabla:{
                tabla:'sq',
                columna:'FOLIO'
            },
            condicion:'=',
            valor:`${alias}.Folio`
        })
        return sentence
    }
    static consultaCompaq(dbname:string){
        return sqlBuilder.SELECT([
            `CASE
            WHEN cli.CRFC = 'XAXX010101000'
                THEN cli.CTEXTOEXTRA3
            ELSE cli.CRAZONSOCIAL
        END AS NOMBRE`
        ,'CTOTAL AS TOTAL'
        ,'CFECHA AS EXPEDICION'
        ,'CSERIEDOCUMENTO AS SERIE'
        ,'CFOLIO AS FOLIO'
        ,'CCODIGOCLIENTE AS CODIGO'
        ],0) + sqlBuilder.FROM(dbname, 'admDocumentos', 'docs')
        +sqlBuilder.LEFT_JOIN({
            tabla1:{
                tabla:'docs',
                columna:'CIDCLIENTEPROVEEDOR'
            },
            tabla2:{
                tabla:'admClientes',
                columna:'CIDCLIENTEPROVEEDOR'
            }
        }, 'cli', dbname)
    }
}