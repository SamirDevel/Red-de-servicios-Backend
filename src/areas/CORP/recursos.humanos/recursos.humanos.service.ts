import { Injectable } from '@nestjs/common';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Agente from 'src/entidades/entidadesCORP/agentes.entity';
import AgentesDes from 'src/entidades/entidadesDesarrollos/Cuentas/agentes.des.entity';
import RelacionesAgentesDes from 'src/entidades/entidadesDesarrollos/Cuentas/relaciones.agentes.entity';
import { ComisionService } from 'src/Servicios/Servicos_Desarrollo/Comisiones/Comision.service';
import AgenteRH from '../../../entidades/entidadesCORP/Extendidas/rh.agente.entity';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';
import { ChoferService } from 'src/Servicios/Servicos_Desarrollo/viajes/chofer/chofer.service';
import Documento from 'src/entidades/entidadesCORP/documentos.entity';

interface agente{
    nombre:string,
    tipo:number
}

interface chofer{
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
    municipio:string
}
@Injectable()
export class RecursosHumanosService {
    constructor(
        @InjectRepository(Agente,'cdc') private ageRepoCDC:Repository<Agente>,
        @InjectRepository(Agente,'cmp') private ageRepoCMP:Repository<Agente>,
        @InjectRepository(AgentesDes,'cuentas') private ageRepoDes:Repository<AgentesDes>,
        //@InjectRepository(AgenteRH,'cuentas') private ageRepoDesRH:Repository<AgenteRH>,
        @InjectRepository(RelacionesAgentesDes,'cuentas') private relRepoDes:Repository<RelacionesAgentesDes>,
        @InjectRepository(Documento,'cdc') private docRepoCDC:Repository<Documento>,
        @InjectRepository(Documento,'cmp') private docRepoCMP:Repository<Documento>,
        private comisionService:ComisionService,
        private viaService:ViajesService,
        private choService:ChoferService
    ){     }

    private async getIds(){
        const idCM = (await this.ageRepoCMP.query('SELECT TOP(1) CIDAGENTE AS ID FROM admAgentes ORDER BY CIDAGENTE DESC'))[0]['ID'] + 1;
        const idCD = (await this.ageRepoCDC.query('SELECT TOP(1) CIDAGENTE AS ID FROM admAgentes ORDER BY CIDAGENTE DESC'))[0]['ID'] + 1;
        return {idCM, idCD}
    }
    private async getCodigo(){
        const numeroAgente = (await this.ageRepoCMP.query('SELECT COUNT(*) AS ID FROM admAgentes WHERE CTIPOAGENTE = 2'))[0]['ID'] + 1;
        return `AG${numeroAgente}`        
    }

    private async insertToDatabase(nuevoAgente:Agente, {idCM, idCD}, nuevoAgenteDes?:AgentesDes){
        try {
            if(nuevoAgenteDes!==undefined)await this.ageRepoDes.save(nuevoAgenteDes);
            nuevoAgente.id=idCM
            await this.ageRepoCMP.save(nuevoAgente);
            nuevoAgente.id=idCD
            await this.ageRepoCDC.save(nuevoAgente);
            return 'Agente creado con exito'
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal insertando el agente, reportar a soporte'}        
        }
    }
    async insertAgente(data:agente){
        const {idCM, idCD} = await this.getIds();
        const nuevoAgente = new Agente();
        const codigo = await this.getCodigo();
        nuevoAgente.setAgente({
            nombre:data.nombre,
            codigo
        })
        const nuevoAgenteDes = new AgentesDes();
        nuevoAgenteDes.setAgenteDes(data.tipo, codigo);
        return await this.insertToDatabase(nuevoAgente, {idCM, idCD}, nuevoAgenteDes)
    }

    async insertChofer(data:chofer){
        const {idCM, idCD} = await this.getIds();
        const nuevoAgente = new Agente();
        nuevoAgente.setChofer(data)
        console.log(nuevoAgente);
        return await this.insertToDatabase(nuevoAgente, {idCM, idCD})
    }

    async getRelacionesAgentes(codigo?:string){
        try {
            const lista = this.ageRepoDes.createQueryBuilder('admins')
            .select('admins.codigo')
            .distinct(true)
            .addSelect('admins.nombre')
            .addSelect('rel.id')
            .addSelect('dep.codigo')
            .addSelect('dep.nombre')
            .leftJoin('admins.dependientes', 'rel')
            .leftJoin('rel.codDependiente', 'dep')
            .andWhere('admins.estatus = :est',{est:'ACTIVO'})
            .andWhere('admins.grupo = :g', {g:1})
            return await lista.getMany();
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al momento de cargar las relaciones, informar a Soporte Técnico'} ;
        }
    }

    async setRelacionesAgentes(admin:string, dep:string){
        try {
            const codDependiente = await this.ageRepoDes.createQueryBuilder('dep')
                .select()
                .where('dep.codigo = :dep', {dep})
                .getOne()
                const relacion = this.relRepoDes.create({
                    codAdmin:admin, 
                    codDependiente:codDependiente
                });
            //console.log(relacion);
            await this.relRepoDes.save(relacion);
            return {mensaje:'Relacion creada con exito'}
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al momento de crear la relacion, informar a Soporte Técnico'} ;
        }
    }

    async quitRelaconesAgentes(admin:string,dep:string){
        try {
            const toDelete = await this.relRepoDes.createQueryBuilder('rels')
            .select('rels.id')
            .andWhere('rels.codAdmin = :admin', {admin})
            .andWhere('rels.codDependiente = :dep', {dep})
            .getOne();
            //console.log(toDelete);
            this.relRepoDes.remove(toDelete)
            return {mensaje:'Relacion eliminada con exito'}
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al momento de eliminar la relacion, informar a Soporte Técnico'} ;
        }
    }
    
    //#region Calculo de comisiones
    async getRelacionesComision(fechaI:string, fechaF:string, tipo:number, agente?:string){
        try {
            
            const registros = await this.comisionService.getList(fechaI, fechaF, tipo, agente)
            if(registros.length>0)return {guardados:true, registros}
            const resut = await this.comisionService.getRelacionesComision(fechaI,fechaF,tipo,agente);
            //console.log(resut)
            return {guardados:false,registros: resut};
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al momento de cargar las relaciones de comisiones desde rh, informar a Soporte Técnico'} ;
        }
    }
    async getComisionesChofer(fechaI:string, fechaF:string, tipo:number, chofer?:string){
        try {
            const registros = await this.comisionService.getListChofer(fechaI, fechaF, tipo, chofer)
            if(registros.length>0)return {guardados:true, registros}
            const resut = await this.comisionService.getViajesChofer(fechaI,fechaF,tipo,chofer);
            return {guardados:false,registros: resut};
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al momento de cargar las relaciones de comisiones desde rh, informar a Soporte Técnico'} ;
        }
    }
    //#endregion
    private getRepo(empresa:string){
        if(empresa==='cdc')return this.docRepoCDC
        if(empresa==='cmp')return this.docRepoCMP
        return null;
    }


    async getDoc(empresa:string, serie:string, folio:number){
        const repo = this.getRepo(empresa);
        if(repo!==null){
            try {
                const factura = await repo.createQueryBuilder('doc')
                .select('doc.serie')
                .addSelect('doc.folio')
                .addSelect('doc.total')
                .addSelect('doc.unidades')
                .addSelect('cli.nombre')
                .addSelect('cli.rfc')
                .addSelect('dom.tipoDireccion')
                .addSelect('dom.calle')
                .addSelect('dom.exterior')
                .addSelect('dom.colonia')
                .addSelect('dom.municipio')
                .addSelect('dom.codigoPostal')
                .addSelect('dom.estado')
                .leftJoin('doc.idCliente', 'cli')
                .leftJoin('cli.domicilios', 'dom')
                .where('doc.serie= :serie AND doc.folio = :folio', {serie, folio})
                .andWhere('dom.tipoCatalogo = 1')
                .getOne();
                if(factura===null)return {mensaje:'La busqueda no arrojo resultados'}
                return factura;
            } catch (error) {
                console.log(error)
                return {mensaje:'Algo salio mal al consulñtar la factura, reportar a soporte técnico'}
            }
        }else return {mensaje:'La seleccion de empresa no es válida'}
    }
}