import { Entity, Column, PrimaryColumn, DataSource} from "typeorm";

@Entity({
    name:'admDocumentos',
})

export default class Documentos{
    @PrimaryColumn({type:'integer', name:'CIDDOCUMENTO'})
    private id:string;

    @Column({name:'CSERIEDOCUMENTO'})
    private serie:string;

    @Column({name:'CFOLIO'})
    private Folio:number
    
    @Column({name:'CTOTAL'})
    private total:number

    @Column({name:'CFECHA'})
    private expedicion:Date
}