import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Agente from 'src/entidades/agentes.entity';

@Injectable()
export class AgentesService {
    constructor(
        @InjectRepository(Agente,'cdc') private docRepoCDC:Repository<Agente>,
        @InjectRepository(Agente,'cmp') private docRepoCMP:Repository<Agente>
    ){    }

    private async queryBase(bdname:string){
        let builder:Repository<Agente> = null;
        if(bdname==='cdc'){
            builder = this.docRepoCDC;
        }else if(bdname==='cmp'){
            builder = this.docRepoCMP;
        }else{
            return null;
        }
        const result = builder.createQueryBuilder('agentes')
        .select('agentes.nombre')
        .addSelect('agentes.codigo')
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
