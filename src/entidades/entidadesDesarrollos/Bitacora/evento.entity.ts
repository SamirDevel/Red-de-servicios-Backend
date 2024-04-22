import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import Motivo from "./motivo.entity"

@Entity ({name: 'Evento'})
export default class Evento{
    @PrimaryGeneratedColumn({name:'Id'})
    id:number

    @Column({name:'Evento'})
    evento:string

    @Column({name:'Descripcion'})
    descripcion:string

    @OneToMany(()=>Motivo, mot=>mot.idEvento)
    motivos:Motivo[]
}