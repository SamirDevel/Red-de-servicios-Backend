import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import BasesDatos from "./base.entity"
import Motivo from "./motivo.entity"

@Entity ({name: 'Tablas'})
export default class Tabla{
    @PrimaryGeneratedColumn({name:'Id'})
    id:number

    @ManyToOne(()=>BasesDatos, bas=>bas.tablas)
    @JoinColumn({name:'Id_Base'})
    idBase:BasesDatos

    @Column({name:'Nombre'})
    nombre:string
    
    @Column({name:'Descripcion'})
    descripcion:number

    @OneToMany(()=>Motivo, mot=>mot.idTabla)
    registros:Motivo[]
    
}