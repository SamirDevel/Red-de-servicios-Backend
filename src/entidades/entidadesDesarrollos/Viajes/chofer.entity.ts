
import { Entity, Column, PrimaryGeneratedColumn, OneToMany,
    VirtualColumn } from "typeorm";
import Viaje from "./viajes.entity";

@Entity({name:'Chofer'})
export default class Chofer{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @Column({name:'Codigo'})
    codigo:string;

    @Column({name:'Estatus'})
    estatus:string;

    @Column({name:'Tipo'})
    tipo:number;

    @Column({name:'Vigencia_Licencia'})
    vigencia:Date;

    @VirtualColumn({query:(alias)=>`SELECT  CNOMBREAGENTE
    FROM ${process.env.DB_NAME_CDC}.dbo.admAgentes ag
    WHERE ag.CCODIGOAGENTE = ${alias}.Codigo`})
    nombre:string;

    @VirtualColumn({query:(alias)=>`DATEDIFF(DAY, GETDATE(), ${alias}.Vigencia_Licencia)`})
    vigenciaRestante:number;

    @OneToMany(()=>Viaje, via=>via.chofer)
    viajes:Viaje[]

    @OneToMany(()=>Viaje, via=>via.auxiliar)
    viajesAux:Viaje[]
}