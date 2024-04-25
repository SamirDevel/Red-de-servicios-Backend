import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, AfterLoad,
    VirtualColumn, JoinColumn } from "typeorm";

@Entity({name:'Facturas_Cerradas'})
export default class FacturaCerrada{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @Column({name:'Serie'})
    serie:string;

    @Column({name:'Folio'})
    folio:number;

    @Column({name:'Motivo'})
    motivo:string;

    @Column({name:'Fecha'})
    fecha:Date;
}