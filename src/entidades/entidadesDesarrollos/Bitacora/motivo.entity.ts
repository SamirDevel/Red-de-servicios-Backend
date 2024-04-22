import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import Registro from "./registro.entity"
import Tabla from "./tabla.entity"
import Evento from "./evento.entity"

@Entity ({name: 'Motivo'})
export default class Motivo{
    @PrimaryGeneratedColumn({name:'Id'})
    id:number

    @Column({name:'Motivo'})
    motivo:string

    @Column({name:'Descipcion'})
    descripcion:string

    @ManyToOne(()=>Tabla, tab=>tab.registros)
    @JoinColumn({name:'Id_Tabla'})
    idTabla:Tabla

    @ManyToOne(()=>Evento, eve=>eve.motivos)
    @JoinColumn({name:'Id_Evento'})
    idEvento:Evento

    @OneToMany(()=>Registro, reg=>reg.idMotivo)
    registros:Registro[]
}