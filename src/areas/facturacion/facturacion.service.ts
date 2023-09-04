import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { empresa } from 'src/entidades/tiposDatos';
import Externo from 'src/entidades/externos.entity';
import QueryFactory from '../../query.factory';

@Injectable()
export class FacturacionService {
    constructor(
        @InjectRepository(Externo,'cdc') private docRepoCDC:Repository<Externo>,
        @InjectRepository(Externo,'cmp') private docRepoCMP:Repository<Externo>
    ){     }

    async insertCliente(params:Object) {
        
    }
}
