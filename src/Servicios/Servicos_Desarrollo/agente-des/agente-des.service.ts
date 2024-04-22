import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import AgentesDes from 'src/entidades/entidadesDesarrollos/Cuentas/agentes.des.entity';
import Agente from 'src/entidades/entidadesCORP/agentes.entity';

@Injectable()
export class AgenteDesService {
    constructor(
        @InjectRepository(Agente,'cdc') private ageRepoCDC:Repository<Agente>,
        @InjectRepository(Agente,'cmp') private ageRepoCMP:Repository<Agente>,
        @InjectRepository(AgentesDes,'cuentas') private ageRepoDES:Repository<AgentesDes>
    ) {}


    setAgente(){

    }

    async getAgente(codigo:string){
        const agente = this.ageRepoDES.createQueryBuilder('age')
            .select('age.nombre')
            .addSelect('age.estatus')
            .addSelect('age.esquema')
            .addSelect('age.codigo')
            .addSelect('age.grupo')
            .where('age.codigo = :codigo',{codigo});
        return await agente.getOne()
    }

    async list(){
        const lista = this.ageRepoDES.createQueryBuilder('age')
            .select('age.nombre')
            .addSelect('age.esquema')
            .addSelect('age.codigo')
            .addSelect('age.estatus')
            .addSelect('age.grupo')
        return await lista.getMany()
            
    }

    async updateAgente(datos:Partial<AgentesDes>){
        try {
            let changed = false
            const ageCDC = await this.ageRepoCDC.createQueryBuilder('age')
                .select('age.id')
                .addSelect('age.nombre')
                .where('age.codigo = :cod', {cod:datos.codigo})
                .getOne()
            const ageCMP = await this.ageRepoCMP.createQueryBuilder('age')
                .select('age.id')
                .addSelect('age.nombre')
                .where('age.codigo = :cod', {cod:datos.codigo})
                .getOne()
            const ageDES = await this.ageRepoDES.createQueryBuilder('age')
                .select('age.id')
                .addSelect('age.estatus')
                .addSelect('age.esquema')
                .where('age.codigo = :cod', {cod:datos.codigo})
                .getOne()
            if(datos.nombre!=undefined){
                changed = true
                ageCDC.nombre = datos.nombre;
                ageCMP.nombre = datos.nombre;
                await this.ageRepoCDC.save(ageCDC);
                await this.ageRepoCMP.save(ageCMP);
            }
            if(datos.estatus!==undefined){
                changed = true
                ageDES.estatus = datos.estatus
            }
            if(datos.esquema!==undefined){
                changed = true
                ageDES.esquema = datos.esquema
            }
            if(datos.grupo!==undefined){
                changed = true
                ageDES.grupo = datos.grupo
            }
            if(changed===true)await this.ageRepoDES.save(ageDES)
            return 'Agente actualizado con exito';
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal al actualizar al agente, reportar a soporte tecnico'}
        }
    }

    
}
