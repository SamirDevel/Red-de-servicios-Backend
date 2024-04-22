import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Vehiculo from 'src/entidades/entidadesDesarrollos/Viajes/vehiculo.entity';
import Agente from 'src/entidades/entidadesCORP/agentes.entity';

interface vehiculo{
    nombre:string
    codigo:string
    año:number
    placas:string
    numPermiso:string
    aseguradora:string
    poliza:string
    tipoPermiso:string
    configuracion:string
    capacidad:number
    vigencia:Date
    estatus:string
}
@Injectable()
export class VehiculoService {
    constructor(
        @InjectRepository(Agente, 'cdc') private vehRepoCDC:Repository<Agente>,
        @InjectRepository(Agente, 'cmp') private vehRepoCMP:Repository<Agente>,
        @InjectRepository(Vehiculo, 'viajes') private vehRepoDES:Repository<Vehiculo>,
    ){    }

    private async getIds(){
        const idCM = (await this.vehRepoCMP.query('SELECT TOP(1) CIDAGENTE AS ID FROM admAgentes ORDER BY CIDAGENTE DESC'))[0]['ID'] + 1;
        const idCD = (await this.vehRepoCDC.query('SELECT TOP(1) CIDAGENTE AS ID FROM admAgentes ORDER BY CIDAGENTE DESC'))[0]['ID'] + 1;
        return {idCM, idCD}
    }

    private async insert(nuevoAgenteDes:Vehiculo, nuevoAgente:Agente){
        try {
            const {idCM, idCD} = await this.getIds();
            await this.vehRepoDES.save(nuevoAgenteDes);
            nuevoAgente.id=idCM
            await this.vehRepoCMP.save(nuevoAgente);
            nuevoAgente.id=idCD
            await this.vehRepoCDC.save(nuevoAgente);
            return 'Agente creado con exito'
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal insertando el vehiculo, reportar a soporte'}
        }
    }

    private makeCodigo(codigo:string){
        let cad=''
        const end = 4-codigo.length;
        for(let i=0; i<end; i++){
            cad +='0';
        };
        return `${cad}${codigo}`;
    }

    async create(datos:vehiculo){
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const limite = new Date();
        limite.setFullYear(today.getFullYear()+1);
        const vigencia = new Date(datos.vigencia);
        if(vigencia<today||vigencia>limite)return {mensaje:'La vigencia proporcionada debe estar en el rango valido'}
        datos.codigo = this.makeCodigo(datos.codigo);
        const vehiculoCompaq = new Agente()
        vehiculoCompaq.setAuto(datos);
        const vehiculo = this.vehRepoDES.create({
            codigo:datos.codigo,
            estatus:datos.estatus,
            capacidad:datos.capacidad,
            vigencia:datos.vigencia
        });
        return await this.insert(vehiculo, vehiculoCompaq);
    }

    async getOne(codigo:string){
        const vehiculo = await this.vehRepoDES.createQueryBuilder('veh')
            .select('veh.id')
            .addSelect('veh.nombre')
            .addSelect('veh.estatus')
            .addSelect('veh.codigo')
            .addSelect('veh.vigencia')
            .addSelect('veh.vigenciaRestante')
            .addSelect('veh.capacidad')
            .addSelect('veh.km')
            .where('veh.codigo = :codigo',{codigo})
            .getOne()
        const datos = await this.vehRepoCDC.createQueryBuilder('veh')
            .select('veh.nombre')
            .addSelect('veh.idProveedor')
            .addSelect('veh.segmento1')
            .addSelect('veh.txt1')
            .addSelect('veh.txt2')
            .addSelect('veh.txt3')
            .addSelect('veh.segmento2')
            .addSelect('veh.segmento3')
            .where('veh.codigo = :codigo',{codigo})
            .getOne();
        return {...vehiculo, ...datos}
    }

    async getList(estatus?:string){
        const agentes = this.vehRepoDES.createQueryBuilder('veh')
            .select('veh.nombre')
            .addSelect('veh.estatus')
            .addSelect('veh.codigo')

        if(estatus!==undefined)agentes.where('veh.estatus = :estatus',{estatus})
        return await agentes.getMany()
    }

    async getListExtended(estatus?:string){
        const agentes = this.vehRepoDES.createQueryBuilder('veh')
            .select('veh.nombre')
            .addSelect('veh.estatus')
            .addSelect('veh.codigo')
            .addSelect('veh.placas')
            .addSelect('veh.km')
            .addSelect('veh.vigencia')
        if(estatus!==undefined)agentes.where('veh.estatus = :estatus',{estatus})
        return await agentes.getMany()
    }

    private comprobar<T extends Agente, K extends vehiculo, D extends Vehiculo>(obj:T|D, llave:keyof T|keyof D, valor:Partial<K>, llave2:keyof K){
        if(valor[llave2]!==undefined){
            const valorAsUnknown = valor[llave2] as unknown;
            const llaveT = llave as keyof T;
            const llaveD = llave as keyof D;
            if(obj instanceof Agente){
                obj[llaveT] = valorAsUnknown as T[keyof T];
            }if(obj instanceof Vehiculo){
                obj[llaveD] = valorAsUnknown as D[keyof D];
            }
        }
    }

    private comprobarDoble<T extends Agente, K extends vehiculo>(obj1:T, obj2:T, llave:keyof T, datos:Partial<K>, llave2:keyof K){
        this.comprobar(obj1,llave,datos,llave2)
        this.comprobar(obj2,llave,datos,llave2)
    }

    async update(datos:Partial<vehiculo>){
        try {
            const ageCDC = await this.vehRepoCDC.createQueryBuilder('veh')
                .select('veh.id')
                .addSelect('veh.nombre')
                .addSelect('veh.idProveedor')
                .addSelect('veh.segmento1')
                .addSelect('veh.txt1')
                .addSelect('veh.txt2')
                .addSelect('veh.txt3')
                .addSelect('veh.segmento2')
                .addSelect('veh.segmento3')
                .where('veh.codigo = :cod', {cod:datos.codigo})
                .getOne()
            const ageCMP = await this.vehRepoCMP.createQueryBuilder('veh')
                .select('veh.id')
                .addSelect('veh.nombre')
                .addSelect('veh.idProveedor')
                .addSelect('veh.segmento1')
                .addSelect('veh.txt1')
                .addSelect('veh.txt2')
                .addSelect('veh.txt3')
                .addSelect('veh.segmento2')
                .addSelect('veh.segmento3')
                .where('veh.codigo = :cod', {cod:datos.codigo})
                .getOne()
            const ageDES = await this.vehRepoDES.createQueryBuilder('veh')
                .select('veh.id')
                .addSelect('veh.estatus')
                .addSelect('veh.capacidad')
                .addSelect('veh.vigencia')
                .where('veh.codigo = :cod', {cod:datos.codigo})
                .getOne()
            this.comprobarDoble(ageCDC, ageCMP, 'nombre', datos, 'nombre')
            this.comprobarDoble(ageCDC, ageCMP, 'idProveedor', datos, 'año')
            this.comprobarDoble(ageCDC, ageCMP, 'segmento1', datos, 'placas')
            this.comprobarDoble(ageCDC, ageCMP, 'txt1', datos, 'numPermiso')
            this.comprobarDoble(ageCDC, ageCMP, 'txt2', datos, 'aseguradora')
            this.comprobarDoble(ageCDC, ageCMP, 'txt3', datos, 'poliza')
            this.comprobarDoble(ageCDC, ageCMP, 'segmento2', datos, 'tipoPermiso')
            this.comprobarDoble(ageCDC, ageCMP, 'segmento3', datos, 'configuracion')
            this.comprobar(ageDES, 'capacidad', datos, 'capacidad')
            this.comprobar(ageDES, 'vigencia', datos, 'vigencia')
            this.comprobar(ageDES, 'estatus', datos, 'estatus')
            this.vehRepoDES.save(ageDES)
            await this.vehRepoCDC.save(ageCDC);
            await this.vehRepoCMP.save(ageCMP);
            return 'Agente actualizado con exito';
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal al actualizar al agente, reportar a soporte tecnico'}
        }
    }

    async onViaje(cod:string){
        const viajes = await this.vehRepoDES.createQueryBuilder('veh')
            .select('COUNT(veh.estatus) AS pendientes')
            .leftJoin('veh.viajes', 'vjs')
            .where('vjs.estatus = :es',{es:'PENDIENTE'})
            .andWhere('veh.codigo = :cod', {cod})
            .getRawOne();
        return (viajes['pendiente']>2);
    }

}

