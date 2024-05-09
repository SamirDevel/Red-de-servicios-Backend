import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Chofer from 'src/entidades/entidadesDesarrollos/Viajes/chofer.entity';
import AgenteChofer from '../../../../entidades/entidadesCORP/Extendidas/Agente.chofer.entity';
import DomicilioChofer from '../../../../entidades/entidadesCORP/Extendidas/Domicilio.chofer.entity';

interface chofer{
    estatus:'ACTIVO'|'INACTIVO'
    tipo:number
    nombre:string
    codigo:string
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
    estado:string
    municipio:string
    vigencia:Date
}

@Injectable()
export class ChoferService {
    constructor(
        @InjectRepository(Chofer, 'viajes') private chofRepo:Repository<Chofer>,
        @InjectRepository(AgenteChofer, 'cdc') private agChofRepoCDC:Repository<AgenteChofer>,
        @InjectRepository(DomicilioChofer, 'cdc') private domRepoCDC:Repository<DomicilioChofer>,
        @InjectRepository(AgenteChofer, 'cmp') private agChofRepoCMP:Repository<AgenteChofer>,
        @InjectRepository(DomicilioChofer, 'cmp') private domRepoCMP:Repository<DomicilioChofer>,
    ){    }

    private async getIds(){
        const idCM = (await this.agChofRepoCMP.query('SELECT TOP(1) CIDAGENTE AS ID FROM admAgentes ORDER BY CIDAGENTE DESC'))[0]['ID'] + 1;
        const idCD = (await this.agChofRepoCDC.query('SELECT TOP(1) CIDAGENTE AS ID FROM admAgentes ORDER BY CIDAGENTE DESC'))[0]['ID'] + 1;
        return {idCM, idCD}
    }

    private async getIdsDom(){
        const idCMDom = (await this.domRepoCDC.query('SELECT TOP(1) CIDDIRECCION AS ID FROM admDomicilios ORDER BY CIDDIRECCION DESC'))[0]['ID'] + 1;
        const idCDDom = (await this.domRepoCMP.query('SELECT TOP(1) CIDDIRECCION AS ID FROM admDomicilios ORDER BY CIDDIRECCION DESC'))[0]['ID'] + 1;
        return {idCMDom, idCDDom}
    }

    private async insert(nuevoAgenteDes:Chofer, nuevoAgente:AgenteChofer){
        try {
            const {idCM, idCD} = await this.getIds();
            const {idCMDom, idCDDom} = await this.getIdsDom();
            console.log(nuevoAgenteDes);
            await this.chofRepo.save(nuevoAgenteDes);
            nuevoAgente.id=idCM
            nuevoAgente.domicilios[0].id = idCMDom
            await this.agChofRepoCMP.save(nuevoAgente);
            nuevoAgente.id=idCD
            nuevoAgente.domicilios[0].id = idCDDom
            await this.agChofRepoCDC.save(nuevoAgente);
            return 'Chofer creado con exito'
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal insertando el agente, reportar a soporte'}        
        }
    }

    async create(datos:chofer){
        const choferCompaq = new AgenteChofer()
        choferCompaq.setChofer(datos);
        choferCompaq.domicilios = new Array();
        choferCompaq.domicilios.push((()=>{
            const dom = new DomicilioChofer();
            dom.setDom(datos);
            if(datos.interior!==undefined)dom.interior = datos.interior;
            if(datos.telefono2!==undefined)dom.tel2 = datos.telefono2;
            dom.tipoCatalogo = 7
            dom.tipoDireccion = 0
            return dom
        })());
        const chofer = this.chofRepo.create({
            estatus:datos.estatus,
            codigo:datos.codigo,
            tipo:datos.tipo,
            vigencia:datos.vigencia
        });
        return await this.insert(chofer, choferCompaq);
    }

    async getOne(codigo:string){
        const agente = await this.chofRepo.createQueryBuilder('cho')
            .select('cho.id')
            .addSelect('cho.nombre')            
            .addSelect('cho.estatus')
            .addSelect('cho.codigo')
            .addSelect('cho.tipo')
            .addSelect('cho.vigencia')
            .addSelect('cho.vigenciaRestante')
            .where('cho.codigo = :codigo',{codigo})
            .getOne()
        const datos = await this.agChofRepoCDC.createQueryBuilder('cho')
            .select('cho.nombre')
            .addSelect('cho.segmento1')
            .addSelect('cho.txt1')
            .addSelect('dom.calle')
            .addSelect('dom.interior')
            .addSelect('dom.exterior')
            .addSelect('dom.colonia')
            .addSelect('dom.codigoPostal')
            .addSelect('dom.municipio')
            .addSelect('dom.ciudad')
            .addSelect('dom.estado')
            .addSelect('dom.pais')
            .addSelect('dom.tel1')
            .addSelect('dom.tel2')
            .addSelect('dom.tel3')
            .addSelect('dom.tel4')
            .addSelect('dom.tipoCatalogo')
            .addSelect('dom.tipoDireccion')
            .leftJoin('cho.domicilios', 'dom')
            .where('cho.codigo = :codigo',{codigo})
            .andWhere('dom.tipoCatalogo = :tipoC', {tipoC:7})
            .andWhere('dom.tipoDireccion = :tipoD', {tipoD:0})
            .getOne();
        return {...datos, ...agente, }
    }

    async getList(estatus?:string){
        const agentes = this.chofRepo.createQueryBuilder('cho')
            .select('cho.nombre')
            .addSelect('cho.estatus')
            .addSelect('cho.codigo')

        if(estatus!==undefined)agentes.where('cho.estatus = :estatus',{estatus})
        return await agentes.getMany()
    }

    private switch<T>(original:T, nuevo:T){
        if(nuevo!==undefined)return nuevo;
        return original;
    }

    private switchEntity(entity:AgenteChofer, datos:Partial<chofer>){
        entity.nombre = this.switch(entity.nombre,datos.nombre);
        entity.segmento1 = this.switch(entity.segmento1,datos.rfc);
        entity.txt1 = this.switch(entity.txt1,datos.licencia);
        return entity;
    }

    private switchDom(domicilio:DomicilioChofer, datos:Partial<chofer>){
        
        domicilio.calle = this.switch(domicilio.calle,datos.calle)
        domicilio.exterior = this.switch(domicilio.exterior,datos.exterior)
        domicilio.interior = this.switch(domicilio.interior,datos.interior)
        domicilio.colonia = this.switch(domicilio.colonia,datos.colonia)
        domicilio.codigoPostal = this.switch(domicilio.codigoPostal,datos.cp)
        domicilio.tel1 = this.switch(domicilio.tel1,datos.telefono)
        domicilio.tel2 = this.switch(domicilio.tel2,datos.telefono2)
        domicilio.tel3 = this.switch(domicilio.tel3,datos.telefono3)
        domicilio.tel4 = this.switch(domicilio.tel4,datos.telefono4)
        domicilio.pais = this.switch(domicilio.pais,datos.pais)
        domicilio.ciudad = this.switch(domicilio.ciudad,datos.ciudad)
        domicilio.municipio = this.switch(domicilio.municipio,datos.municipio)
        return domicilio;
    }

    private async getEntity(repo:Repository<AgenteChofer>, codigo:string){
        return await repo.createQueryBuilder('cho')
        .select('cho.id')
        .addSelect('cho.nombre')
        .addSelect('cho.segmento1')
        .addSelect('cho.txt1')
        .where('cho.codigo = :codigo',{codigo})
        .getOne();
    }

    private async getDom(repo:Repository<DomicilioChofer>, id:number){
        return await repo.createQueryBuilder('dom')
            .select('dom.id')
            .addSelect('dom.calle')
            .addSelect('dom.interior')
            .addSelect('dom.exterior')
            .addSelect('dom.colonia')
            .addSelect('dom.codigoPostal')
            .addSelect('dom.municipio')
            .addSelect('dom.ciudad')
            .addSelect('dom.estado')
            .addSelect('dom.pais')
            .addSelect('dom.tel1')
            .addSelect('dom.tel2')
            .addSelect('dom.tel3')
            .addSelect('dom.tel4')
            .where('dom.idCliente = :id',{id})
            .andWhere('dom.tipoCatalogo = :tipoC', {tipoC:7})
            .andWhere('dom.tipoDireccion = :tipoD', {tipoD:0})
            .getOne();
    }

    async update(datos:Partial<chofer>){
        const ageCDC = await this.getEntity(this.agChofRepoCDC, datos.codigo)
        const ageCMP = await this.getEntity(this.agChofRepoCMP, datos.codigo)
        const ageDES = await this.chofRepo.createQueryBuilder('age')
            .select('age.id')
            .addSelect('age.nombre')
            .addSelect('age.estatus')
            .addSelect('age.vigencia')
            .where('age.codigo = :cod', {cod:datos.codigo})
            .getOne()
        ageCDC.nombre = ageCMP.nombre = ageDES.nombre;
        const domCDC = await this.getDom(this.domRepoCDC, ageCDC.id)
        const domCMP = await this.getDom(this.domRepoCMP, ageCMP.id)

        this.switchEntity(ageCDC, datos);
        this.switchEntity(ageCMP, datos);

        this.switchDom(domCDC, datos);
        this.switchDom(domCMP, datos);
        if(datos.estatus!==undefined)ageDES.estatus = datos.estatus;
        if(datos.tipo!==undefined)ageDES.tipo = datos.tipo;
        if(datos.vigencia!==undefined)ageDES.vigencia = datos.vigencia;
        try {
            await this.agChofRepoCDC.save(ageCDC);
            await this.domRepoCDC.save(domCDC);
            await this.agChofRepoCMP.save(ageCMP);
            await this.domRepoCMP.save(domCMP)    
            await this.chofRepo.save(ageDES);
            return 'Agente actualizado con exito';
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal al actualizar al agente, reportar a soporte tecnico'}
        }
    }

    async onViaje(cod:string){
        const viajes = await this.chofRepo.createQueryBuilder('chof')
            .select('COUNT(vjs.estatus) AS pendientes')
            .leftJoin('chof.viajes', 'vjs')
            .where('vjs.estatus = :es',{es:'PENDIENTE'})
            .andWhere('chof.codigo = :cod', {cod})
            .getRawOne();
        //console.log(viajes)
        return (viajes['pendientes']>2);
    }

}
