import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Agente from 'src/entidades/entidadesCORP/agentes.entity';
import AgentesDes from 'src/entidades/entidadesDesarrollos/Cuentas/agentes.des.entity';
import QueryFactory from 'src/estructuras_y_algoritmos/query.factory';

@Injectable()
export class AgentesService {
    constructor(
        @InjectRepository(Agente,'cdc') private ageRepoCDC:Repository<Agente>,
        @InjectRepository(Agente,'cmp') private ageRepoCMP:Repository<Agente>,
    ){    }

    private async queryBase(bdname:string){
        let builder:Repository<Agente> = null;
        if(bdname==='cdc'){
            builder = this.ageRepoCDC;
        }else if(bdname==='cmp'){
            builder = this.ageRepoCMP;
        }else{
            return null;
        }
        const result = builder.createQueryBuilder('agentes')
        .select('agentes.nombre')
        .addSelect('agentes.codigo')
        .addSelect('agentes.estatus')
        //const result = new QueryFactory(builder.createQueryBuilder('agentes'))
        return result;
    }

    private async getList(bdname:string, filtro:number){
        const query = await this.queryBase(bdname)
        return query.where(`agentes.tipo = :tipo`,{tipo:filtro})
        .getMany();
    }

    async getListAgente(bdname:string){
        return await this.getList(bdname,2);
    }

    async getListChofer(bdname:string){
        return await this.getList(bdname,4);
    }

    async getListVehiculo(bdname:string){
        return await this.getList(bdname,5);
    }

}
