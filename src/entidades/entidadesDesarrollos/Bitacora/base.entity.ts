import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import Tabla from "./tabla.entity"

@Entity ({name: 'Bases_Datos'})
export default class BasesDatos{
    @PrimaryGeneratedColumn({name:'Id'})
    id:number

    @Column({name:'Nombre'})
    nombre:string
    
    @Column({name:'Descripcion'})
    descripcion:number
    
    @OneToMany(()=>Tabla, tab=>tab.idBase)
    tablas:Tabla[]
    
}