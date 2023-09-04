import { Injectable } from '@nestjs/common';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Agente from 'src/entidades/agentes.entity';


interface agente{
    nombre:string,
    codigo:string
}

interface chofer extends agente{
    rfc:string
    licencia:string
    calle:string
    exterior:string
    interior?:string
    colonia:string
    cp:string
    telefono:string
    telefono2?:string
    telefono3?:string
    telefono4?:string
    pais:string
    ciudad:string
    municipio:string
}

@Injectable()
export class RecursosHumanosService {
    constructor(
        @InjectRepository(Agente,'cdc') private ageRepoCDC:Repository<Agente>,
        @InjectRepository(Agente,'cmp') private ageRepoCMP:Repository<Agente>
    ){     }

    async insertAgente(data){
        const id = (await this.ageRepoCMP.query('SELECT TOP(1) CIDAGENTE AS ID FROM admAgentes ORDER BY CIDAGENTE DESC'))[0]['ID'] + 1;
        data['id'] = id;
        const nuevoAgente = new Agente();
        if(data.rfc!=undefined)nuevoAgente.setChofer(data)
        else nuevoAgente.setAgente(data);
        console.log(nuevoAgente);
        this.ageRepoCMP.save(nuevoAgente);

    }
}
