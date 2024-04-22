import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, AfterLoad,
    VirtualColumn } from "typeorm";
import Picking from "./picking.entity";

@Entity({name:'Rango_Picking'})
export default class PickingRango{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @ManyToOne(()=>Picking, pik=>pik.rangos)
    @JoinColumn({name:'Id_Picking'})
    idPicking:Picking;

    @Column({name:'Serie'})
    serie:string

    @Column({name:'Folio_Inicial'})
    folioI:number

    @Column({name:'Folio_Final'})
    folioF:number
}