import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, AfterLoad,
    VirtualColumn } from "typeorm";
import Viaje from "./viajes.entity";

@Entity({name:'Vehiculo'})
export default class Vehiculo{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @Column({name:'Codigo'})
    codigo:string;

    @Column({name:'Estatus'})
    estatus:string;

    @Column({name:'Capacidad'})
    capacidad:number;

    @Column({name:'Vigencia_Seguro'})
    vigencia:Date;

    @VirtualColumn({query:(alias)=>`SELECT  CNOMBREAGENTE
    FROM ${process.env.DB_NAME_CDC}.dbo.admAgentes ag
    WHERE ag.CCODIGOAGENTE = ${alias}.Codigo`})
    nombre:string;

    @VirtualColumn({query:(alias)=>`SELECT  CSEGCONTAGENTE
    FROM ${process.env.DB_NAME_CDC}.dbo.admAgentes ag
    WHERE ag.CCODIGOAGENTE = ${alias}.Codigo`})
    placas:string;

    @VirtualColumn({query:(alias)=>`SELECT TOP (1) Km_Final
    FROM ${process.env.DB_NAME_VIAJES}.dbo.Viaje via
    WHERE via.Id_Vehiculo = ${alias}.Id
    AND via.Estatus = 'COMPLETADO'
    ORDER BY Fecha_Fin DESC`})
    km:number; //Para el kilometraje

    @VirtualColumn({query:(alias)=>`DATEDIFF(DAY, GETDATE(), ${alias}.Vigencia_Seguro)`})
    vigenciaRestante:number;

    @OneToMany(()=>Viaje, via=>via.vehiculo)
    viajes:Viaje[]
}