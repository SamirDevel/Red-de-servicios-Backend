import { Entity, Column, PrimaryColumn, OneToMany, 
    VirtualColumn, OneToOne, JoinColumn } from "typeorm";
import Externo from "./externos.entity";

@Entity({name:'admClasificacionesValores'})
export default class ClasificacionesValores{
    @PrimaryColumn({name:'CIDVALORCLASIFICACION'})
    id:number

    @Column({name:'CVALORCLASIFICACION'})
    valor:string

    @Column({name:'CIDCLASIFICACION'})
    idClasificacion:number

    @Column({name:'CCODIGOVALORCLASIFICACION'})
    codigo:string

    @Column({name:'CSEGCONT1'})
    segcont1:string

    @Column({name:'CSEGCONT2'})
    segcont2:string

    @Column({name:'CSEGCONT3'})
    segcont3:string

    @OneToMany(() =>Externo, ext=>ext.clasificacionCliente2)
    externoClasificadoCDC:Externo[]

    @OneToMany(() =>Externo, ext=>ext.clasificacionCliente4)
    externoClasificadoCMP:Externo[]

    @OneToMany(() =>Externo, ext=>ext.clasificacionCliente1)
    externoRuta:Externo[]
}