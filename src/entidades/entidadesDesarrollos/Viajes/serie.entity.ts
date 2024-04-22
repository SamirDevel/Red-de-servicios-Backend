
import { Entity, Column, PrimaryGeneratedColumn, OneToMany,
    VirtualColumn } from "typeorm";
import Viaje from "./viajes.entity";

@Entity({name:'Series'})
export default class Serie{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;
    
    @Column({name:'Serie'})
    serie:string;

    @Column({name:'Descripcion'})
    descripcion:string;

    @OneToMany(()=>Viaje, via=>via.serie)
    viajes:Viaje
    
}