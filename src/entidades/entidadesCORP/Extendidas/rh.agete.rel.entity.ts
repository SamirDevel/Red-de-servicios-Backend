import {Entity, Column, JoinColumn, PrimaryGeneratedColumn, OneToOne, ManyToOne} from 'typeorm';
import AgenteRH from './rh.agente.entity';
import RelacionesAgentesDes from 'src/entidades/entidadesDesarrollos/Cuentas/relaciones.agentes.entity';

@Entity({name: 'Relaciones_Agentes'})
export default class RHRel extends RelacionesAgentesDes{
    @ManyToOne(()=>AgenteRH, agente=>agente.dependientes)
    @JoinColumn({name:'Cod_Admin', referencedColumnName:'codigo'})
    codAdmin:string;

    @OneToOne(()=>AgenteRH, agente=>agente.codigo)
    @JoinColumn({name:'Cod_Dependiente', referencedColumnName:'codigo'})
    codDependiente:AgenteRH;
}