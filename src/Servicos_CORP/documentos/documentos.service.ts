import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { empresa } from 'src/entidades/tiposDatos';
import Documento from 'src/entidades/documentos.entity';
import QueryFactory from '../query.factory';

@Injectable()
export class DocumentosService {
    private alias:string
    constructor(
        @InjectRepository(Documento,'cdc') private docRepoCDC:Repository<Documento>,
        @InjectRepository(Documento,'cmp') private docRepoCMP:Repository<Documento>
    ){
        this.alias = 'docs'
     }

   private async queryBase(bdname:string) {
        let builder:Repository<Documento> = null;
        if(bdname==='cdc'){
            builder = this.docRepoCDC;
        }else if(bdname==='cmp'){
            builder = this.docRepoCMP;
        }else if(bdname==='corp'){

        }else{
            return null;
        };
        const factory = new QueryFactory(builder.createQueryBuilder());
        return factory.docs();
    }

    async clientData(builder:SelectQueryBuilder<Documento>){
        const factory = new QueryFactory(builder);
        return factory.clients().query;
    }

    async domData(builder:SelectQueryBuilder<Documento>){
        //console.log('entra')
        const factory = new QueryFactory(builder);
        return factory.doms().query.andWhere('Domicilio.tipoCatalogo = :tipoCatalogo',{tipoCatalogo:1})
    }
    async getOne(bdname:empresa, serie:string, folio:number){
        let result:QueryFactory<Documento>=null;

        if(bdname==='cdc'){
            result = (await this.queryBase('cdc'));
        }else if(bdname==='cmp'){
            result = (await this.queryBase('cmp'));
        }else if(bdname==='corp'){

        }else{

        }
        //console.log(result)

        return result.query.where(`${result.query.alias}.serie = :serie`,{serie})
        .andWhere(`${result.query.alias}.folio = :folio`,{folio});
    }
}
