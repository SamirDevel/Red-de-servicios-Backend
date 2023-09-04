import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { empresa } from 'src/entidades/tiposDatos';
import Externo from 'src/entidades/externos.entity';
import QueryFactory from '../../query.factory';

@Injectable()
export class ClientesService {
    constructor(
        @InjectRepository(Externo,'cdc') private extRepoCDC:Repository<Externo>,
        @InjectRepository(Externo,'cmp') private extRepoCMP:Repository<Externo>
    ){    }

    private selecionarBase(bdname:string):Repository<Externo>{
        if(bdname==='cdc'){
            return this.extRepoCDC;
        }else if(bdname==='cmp'){
            return this.extRepoCMP;
        }else{
            return null;
        };
    }

    private async queryBase(builder:Repository<Externo>){
        const factory = new QueryFactory(builder.createQueryBuilder());
        return factory.clients();

    }

    async domData(builder:SelectQueryBuilder<Externo>){
        const factory = new QueryFactory(builder);
        return factory.doms().query;
    }

    async getOne(bdname:empresa, codigo:string){
        let result:QueryFactory<Externo>=null;
        const builder = this.selecionarBase(bdname);
        result = (await this.queryBase(builder));
        return result.query.where(`Externo.codigo = :codigo`,{codigo})
        //console.log(result)
    }

    async getAll(bdname:string){
        let result:QueryFactory<Externo>=null;

        const builder = this.selecionarBase(bdname);
        result = (await this.queryBase(builder));
        //console.log(result)

        return result.query.getMany();
    }

    async getClasificaciones(bdname:string){
        let builder=null;

        if(bdname==='cdc'){
            builder = this.extRepoCDC
        }else if(bdname==='cmp'){
            builder = this.extRepoCMP
        }
        return builder.query(`SELECT [CIDVALORCLASIFICACION] AS id\n`+
        `,[CVALORCLASIFICACION] AS nombre\n`+
        `,[CIDCLASIFICACION] AS tipo\n`+
        `,[CCODIGOVALORCLASIFICACION] AS codigo\n`+
        `FROM [dbo].[admClasificacionesValores]\n`+
        `WHERE CIDCLASIFICACION = (CASE \n`+
        `  WHEN DB_NAME() = '${process.env.DB_NAME_CMP}' THEN 10\n`+
        `  WHEN DB_NAME() = '${process.env.DB_NAME_CDC}' THEN 8\n`+
        `END)\n`+
        `OR CIDCLASIFICACION = 0`);
    }
}
