import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Registro from 'src/entidades/entidadesDesarrollos/Bitacora/registro.entity';
import Evento from 'src/entidades/entidadesDesarrollos/Bitacora/evento.entity';
import Motivo from 'src/entidades/entidadesDesarrollos/Bitacora/motivo.entity';
import Tabla from 'src/entidades/entidadesDesarrollos/Bitacora/tabla.entity';
interface motivo{
    motivo:string
    descripcion:string
}
interface registro {
    registro:number
    columna:string
    anterior:string
    responsable:string,
    motivo:string,
}
@Injectable()
export class BitacoraService {
    constructor(
        @InjectRepository(Evento, 'bitacora') private repEvento:Repository<Evento>,
        @InjectRepository(Tabla, 'bitacora') private repTabla:Repository<Tabla>,
        @InjectRepository(Registro, 'bitacora') private repRegistro:Repository<Registro>,
        @InjectRepository(Motivo, 'bitacora') private repMotivo:Repository<Motivo>,
    ){ }

    async fireEvent(datos:registro){
        const idMotivo = await this.repMotivo.createQueryBuilder('mot')
            .select()
            .where('mot.motivo = :m', {m:datos.motivo})
            .getOne();
        const registro = this.repRegistro.create({
            idMotivo,
            ...datos,
            fecha:new Date(),
        });
        //console.log(registro);
        this.repRegistro.save(registro);
    }
    async getMotivos(tabla:string, evento:string){
        return await this.repMotivo.createQueryBuilder('mot')
            .select()
            .leftJoin('mot.idTabla', 'tab')
            .leftJoin('mot.idEvento', 'eve')
            .where('tab.nombre = :tabla',{tabla})
            .andWhere('eve.evento = :evento', {evento})
            .getMany();
    }
    async setMotivo(tabla:string, evento:string, datos:motivo){
        try {
            const idEvento = await this.repEvento.createQueryBuilder('eve')
                .select()
                .where('eve.evento = :evento', {evento})
                .getOne();
            const idTabla = await this.repTabla.createQueryBuilder('tab')
                .select()
                .where('tab.nombre = :tabla', {tabla})
                .getOne();
            const nuevo = this.repMotivo.create({
                idEvento,
                idTabla,
                ...datos
            })
            this.repMotivo.save(nuevo);
            //console.log(nuevo);
            return 'Motivo creado con esito'
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal creando el motivo, reportar a soporte tecnico'}
        }
    }

}
