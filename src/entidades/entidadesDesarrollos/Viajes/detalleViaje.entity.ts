import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, AfterLoad,
    VirtualColumn, JoinColumn } from "typeorm";
import Viaje from "./viajes.entity";

@Entity({name:'Detalle_Viaje'})
export default class DetalleViaje{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;
    
    @ManyToOne(()=>Viaje, via=>via.id)
    @JoinColumn({name:'Id_Viaje'})
    viaje:Viaje;

    @Column({name:'Serie'})
    serie:string;

    @Column({name:'Folio'})
    folio:number;

    @Column({name:'Hora_Entrega'})
    horaEntrega:string;

    @Column('decimal', {name:'Importe', scale:2, precision:12})
    importe:number;

    @Column({name:'Observaciones'})
    observaciones:string;

    @Column({name:'Destino'})
    destino:string;
    
    @Column({name:'Direccion'})
    direccion:string;
}