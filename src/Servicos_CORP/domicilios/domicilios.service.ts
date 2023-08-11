import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { empresa } from 'src/entidades/tiposDatos';
import Domicilio from 'src/entidades/domicilios.entity';

@Injectable()
export class DomiciliosService {
    private alias:string
    constructor(
        @InjectRepository(Domicilio,'cdc') private docRepoCDC:Repository<Domicilio>,
        @InjectRepository(Domicilio,'cmp') private docRepoCMP:Repository<Domicilio>
    ){
        this.alias = 'dom'
    }
    private async queryBase(bdname:string){
        let builder:Repository<Domicilio> = null;
        if(bdname==='cdc'){
            builder = this.docRepoCDC;
        }else if(bdname==='cmp'){
            builder = this.docRepoCMP;
        }else if(bdname==='corp'){

        }else{
            return null;
        }

        return builder.createQueryBuilder(this.alias)
            .select(`${this.alias}.tipoDireccion`)
            .addSelect(`${this.alias}.calle`)
            .addSelect(`${this.alias}.interior`)
            .addSelect(`${this.alias}.exterior`)
            .addSelect(`${this.alias}.codigoPostal`)
            .addSelect(`${this.alias}.pais`)
            .addSelect(`${this.alias}.estado`)
            .addSelect(`${this.alias}.ciudad`)
            .addSelect(`${this.alias}.municipio`);

    }

    async getAll(bdname:empresa){
        let result=null;

        if(bdname==='cdc'){
            result = (await this.queryBase('cdc'));
        }else if(bdname==='cmp'){
            result = (await this.queryBase('cmp'));
        }else if(bdname==='corp'){

        }else{

        }
        //result = await result.where(`${this.alias}.codigo = :codigo`,{codigo})
        //console.log(result)

        return result;
    }
}
