import { Entity, JoinColumn, ManyToOne } from "typeorm";
import Domicilio from "src/entidades/entidadesCORP/domicilios.entity";
import AgenteChofer from "./Agente.chofer.entity";

@Entity({name:'admDomicilios'})
export default class DomicilioChofer extends Domicilio{

    @ManyToOne(() =>AgenteChofer, (agChof)=>agChof.domicilios)
    @JoinColumn({name:'CIDCATALOGO'})
    idChofer:AgenteChofer
}