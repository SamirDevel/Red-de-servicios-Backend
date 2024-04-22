import {Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne} from 'typeorm';
import AgentesDes from './agentes.des.entity';

@Entity({name: 'Relaciones_Agentes'})
export default class RelacionesAgentesDes{
    
    @PrimaryGeneratedColumn({type:'integer', name:'Id'})
    id:number;
    
    @ManyToOne(()=>AgentesDes, agente=>agente.dependientes)
    @JoinColumn({name:'Cod_Admin', referencedColumnName:'codigo'})
    codAdmin:string;

    @OneToOne(()=>AgentesDes, agente=>agente.codigo)
    @JoinColumn({name:'Cod_Dependiente', referencedColumnName:'codigo'})
    codDependiente:AgentesDes;

}