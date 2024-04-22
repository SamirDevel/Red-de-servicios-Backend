import { Entity, Column, PrimaryGeneratedColumn, OneToMany, AfterLoad,
    VirtualColumn } from "typeorm";
import PickingRango from "./rango.picking.entity";
import PickingDetalle from "./detalle.picking.entity";
import { query } from "express";

@Entity({name:'Picking'})
export default class Picking{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @Column({name:'Fecha'})
    fecha:Date;

    @Column({name:'Ruta'})
    ruta:string;

    @Column({name:'Empresa'})
    empresa:string;

    @OneToMany(()=>PickingRango, ran=>ran.idPicking, {cascade:true})
    rangos:PickingRango[]

    @OneToMany(()=>PickingDetalle, det=>det.idPicking, {cascade:true})
    detalles:PickingDetalle[]

    @VirtualColumn({query(alias){
        return `SELECT qr.NOMBRE
        FROM
        (SELECT [CVALORCLASIFICACION] AS NOMBRE, CCODIGOVALORCLASIFICACION AS CODIGO
        FROM [${process.env.DB_NAME_CMP}].dbo.admClasificacionesValores
        WHERE [CIDCLASIFICACION] = 7
        UNION 
        SELECT [CVALORCLASIFICACION] AS NOMBRE, CCODIGOVALORCLASIFICACION AS CODIGO
        FROM ${process.env.DB_NAME_CDC}.dbo.admClasificacionesValores
        WHERE [CIDCLASIFICACION] = 7) qr
        WHERE qr.CODIGO = ${alias}.Ruta`
    }})
    nombre:string
}