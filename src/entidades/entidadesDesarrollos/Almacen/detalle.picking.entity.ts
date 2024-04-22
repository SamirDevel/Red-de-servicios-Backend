import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, AfterLoad,
    VirtualColumn } from "typeorm";
import Picking from "./picking.entity";

@Entity({name:'Detalle_Picking'})
export default class PickingDetalle{
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;

    @ManyToOne(()=>Picking, pik=>pik.detalles)
    @JoinColumn({name:'Id_Picking'})
    idPicking:Picking;

    @Column({name:'Codigo'})
    codigo:string

    @VirtualColumn({query(alias) {
        return PickingDetalle.getNombre('cdc', alias)
    }})
    nombreCDC:string;

    @VirtualColumn({query(alias) {
        return PickingDetalle.getNombre('cmp', alias)
    }})
    nombreCMP:string;

    nombre:string;

    @Column({name:'Cantidad'})
    cantidad:number

    static getNombre(dbname:string, alias:string){
        let base =null;
        if(dbname==='cdc')base = process.env.DB_NAME_CDC
        if(dbname==='cmp')base = process.env.DB_NAME_CMP
        return `SELECT  CNOMBREPRODUCTO
        FROM ${base}.dbo.admProductos pro
        WHERE ${alias}.Codigo = pro.CCODIGOPRODUCTO`
    }
}

//${alias}