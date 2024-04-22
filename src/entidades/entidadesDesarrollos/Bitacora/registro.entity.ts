import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import Motivo from "./motivo.entity"

@Entity ({name: 'Registro'})
export default class Registro{
    @PrimaryGeneratedColumn({name:'Id'})
    id:number

    @Column({name:'Id_Registro'})
    registro:number

    @Column({name:'Columna'})
    columna:string

    @Column({name:'Responsable'})
    responsable:string

    @Column({name:'Valor_Anterior'})
    anterior:string

    @Column({name:'Fecha'})
    fecha:Date

    @ManyToOne(()=>Motivo, mot=>mot.registros)
    @JoinColumn({name:'Id_Motivo'})
    idMotivo:Motivo
}