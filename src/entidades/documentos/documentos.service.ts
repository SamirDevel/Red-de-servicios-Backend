import { Injectable } from '@nestjs/common';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Documentos from './documentos.entity';
import { empresa } from '../tiposDatos';

@Injectable()
export class DocumentosService {
    constructor(
        @InjectRepository(Documentos, 'cdc') private repoCDC:Repository<Documentos>,
        @InjectRepository(Documentos, 'cmp') private repoCMP:Repository<Documentos>
    ){ }
    async list(empresa:empresa){
        let lista:Repository<Documentos>;
        if(empresa==='cdc')lista = this.repoCDC
        else if(empresa==='cmp')lista = this.repoCMP;

        return lista.find({take:10});
        //this.managerCMP.connection.setOptions({database:process.env.DB_NAME_CMP});
        //return lista;
    }
}
