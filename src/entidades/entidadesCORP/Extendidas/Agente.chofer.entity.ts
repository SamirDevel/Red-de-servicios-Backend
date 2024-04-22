import { Entity, OneToMany} from "typeorm";
import Agente from "src/entidades/entidadesCORP/agentes.entity";
import DomicilioChofer from "./Domicilio.chofer.entity";
@Entity({name:'admAgentes'})
export default class AgenteChofer extends Agente{
    @OneToMany(()=>DomicilioChofer, dom=>dom.idChofer, {cascade:true})
    domicilios:DomicilioChofer[]
}