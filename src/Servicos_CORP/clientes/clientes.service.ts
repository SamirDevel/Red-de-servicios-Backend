import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { empresa } from 'src/entidades/tiposDatos';
import Externo from 'src/entidades/externos.entity';
import QueryFactory from '../query.factory';

@Injectable()
export class ClientesService {
    private alias:string
    constructor(
        @InjectRepository(Externo,'cdc') private docRepoCDC:Repository<Externo>,
        @InjectRepository(Externo,'cmp') private docRepoCMP:Repository<Externo>
    ){    }

    private async queryBase(bdname:string){
        let builder:Repository<Externo> = null;
        if(bdname==='cdc'){
            builder = this.docRepoCDC;
        }else if(bdname==='cmp'){
            builder = this.docRepoCMP;
        }else if(bdname==='corp'){

        }else{
            return null;
        }
        const factory = new QueryFactory(builder.createQueryBuilder());
        return factory.clients().query;

    }

    async domData(builder:SelectQueryBuilder<Externo>){
        const factory = new QueryFactory(builder);
        return factory.doms().query;
    }

    async getOne(bdname:empresa, codigo:string){
        let result=null;

        if(bdname==='cdc'){
            result = (await this.queryBase('cdc'));
        }else if(bdname==='cmp'){
            result = (await this.queryBase('cmp'));
        }else if(bdname==='corp'){

        }else{

        }
        result = await result.where(`Externo.codigo = :codigo`,{codigo})
        //console.log(result)

        return result;
    }
}
