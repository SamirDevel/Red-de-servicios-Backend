import { Entity, Column, PrimaryColumn, ManyToOne,
    JoinColumn, VirtualColumn, OneToOne
} from "typeorm";
import Documento from "./documentos.entity";

@Entity({name:'admAsocCargosAbonos'})
export default class AsocCargosAbonos{
    @PrimaryColumn({name:'CIDAUTOINCSQL'})
    id:number

    @OneToOne(()=>Documento, abono=>abono.id)
    @JoinColumn({name:'CIDDOCUMENTOABONO'})
    //@Column({name:'CIDDOCUMENTOABONO'})
    idAbono:number
    
    @ManyToOne(() =>Documento, (abono)=>abono.pagos)
    @JoinColumn({name:'CIDDOCUMENTOCARGO'})
    idCargo:number
    
    @Column('decimal', {name:'CIMPORTEABONO', scale:6})
    importeAbono:number

    @Column('decimal', {name:'CIMPORTECARGO', scale:6})
    importeCargo:number

    @Column({name:'CFECHAABONOCARGO'})
    fechaAbono:Date
    
    @Column({name:'CIDDESCUENTOPRONTOPAGO'})
    fechaCargo:Date

    @Column({name:'CIDUTILIDADPERDIDACAMB'})
    idUtil:number

    @Column({name:'CIDAJUSIVA'})
    idAjustaIva:number
}