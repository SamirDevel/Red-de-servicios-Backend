import { Injectable } from '@nestjs/common';
import { EntityMetadata, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Viaje from 'src/entidades/entidadesDesarrollos/Viajes/viajes.entity';
import DetalleViaje from 'src/entidades/entidadesDesarrollos/Viajes/detalleViaje.entity';
import Serie from 'src/entidades/entidadesDesarrollos/Viajes/serie.entity';
import { BitacoraService } from '../bitacora/bitacora.service';

interface filtros{
    serie:string
    folio:number
    chofer:string
    vehiculo:string
    ruta:string
    auxiliar:string
    usuario:number
    fechaI:Date
    fechaF:Date
    finI:string
    finF:string
    estatus:string
    gasI:number
    gasF:number
    KmI:number
    KmF:number
    horaI:number
    horaF:number
    serieFactura:string
    folioFactura:string
}
interface registrable{
    responsable:string
    motivo:string
}
@Injectable()
export class ViajesService {
    constructor(
        private bitService:BitacoraService,
        @InjectRepository(Viaje, 'viajes') private viajesRepo:Repository<Viaje>,
        @InjectRepository(DetalleViaje, 'viajes') private detsRepo:Repository<DetalleViaje>,
        @InjectRepository(Serie, 'viajes') private serieRepo:Repository<Serie>,
    ) {}

    async getHead(empresa:'cdc'|'cmp'){
        try {
            const origen = (()=>{
                if(empresa==='cdc')return 1
                if(empresa==='cmp')return 2
                else return -1;
            })();
            const result = await this.viajesRepo.query('EXECUTE GetViaje @empresa = @0', [origen])
            //console.log(result[0]['']);
            return result[0]
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal, informe a soporte tecnico'}
        }
    }

    async create(nuevo:Partial<Viaje>, detalles:Partial<DetalleViaje>[]){
        const viaje = this.viajesRepo.create(nuevo);
        viaje.detalles = detalles.map(det=>this.detsRepo.create(det));
        try {
            //console.log(viaje);
            await this.viajesRepo.save(viaje);
            return 'Viaje creado Exitosamente. ';
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al insertar el viaje, reportar a soporte técnico'}
        }
    }

    async read(filtros?:Partial<filtros>){
        const query = this.viajesRepo.createQueryBuilder('vjs')
                .select()
                .leftJoinAndSelect('vjs.serie', 'ser')
                .leftJoinAndSelect('vjs.chofer', 'cho')
                .leftJoinAndSelect('vjs.auxiliar', 'aux')
                .leftJoinAndSelect('vjs.vehiculo', 'veh')
                .leftJoinAndSelect('vjs.detalles','det');
        try {
            if(filtros!==undefined){
                if(filtros.serie !==undefined)
                    query.andWhere('ser.serie = :serie',{serie:filtros.serie})
                if(filtros.folio !==undefined)
                    query.andWhere('vjs.folio = :folio',{folio:filtros.folio})
                if(filtros.chofer !==undefined)
                    query.andWhere('cho.codigo = :chofer',{chofer:filtros.chofer})
                if(filtros.vehiculo !==undefined)
                    query.andWhere('veh.codigo = :vehiculo',{vehiculo:filtros.vehiculo})
                if(filtros.ruta !==undefined)
                    query.andWhere('vjs.ruta = :ruta',{ruta:filtros.ruta})
                if(filtros.auxiliar !==undefined)
                    query.andWhere('aux.codigo = :auxiliar',{auxiliar:filtros.auxiliar})
                if(filtros.fechaI !==undefined)
                    query.andWhere('vjs.expedicion >= :fechaI',{fechaI:filtros.fechaI})
                if(filtros.fechaF !==undefined)
                    query.andWhere('vjs.expedicion <= :fechaF',{fechaF:filtros.fechaF})
                if(filtros.finI !==undefined)
                    query.andWhere('vjs.fechaFin >= :finI',{finI:filtros.finI})
                if(filtros.finF !==undefined)
                    query.andWhere('vjs.fechaFin <= :finF',{finF:filtros.finF})
                if(filtros.usuario !==undefined)
                    query.andWhere('vjs.usuario = :usuario',{usuario:filtros.usuario})
                if(filtros.estatus !==undefined)
                    query.andWhere('vjs.estatus = :estatus',{estatus:filtros.estatus})
                if(filtros.serieFactura !==undefined)
                    query.andWhere('det.serie = :serieF',{serieF:filtros.serieFactura})
                if(filtros.folioFactura !==undefined)
                    query.andWhere('det.Folio = :folioF',{folioF:filtros.folioFactura})
            }
            return await query.getMany();
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al consultar los viaje, reportar a soporte técnico'}
        }
    }

    private async fireRegister(original:Viaje, key:keyof Viaje, registro:registrable){
        const value = (()=>{
            if(typeof original[key] === 'object')return original[key]['codigo'];
            return original[key].toString();
        })()
        await this.bitService.fireEvent({
            registro:original.id,
            columna:this.viajesRepo.metadata.findColumnWithPropertyName(key).databaseName,
            anterior:value!==undefined?value:original[key] as string,
            responsable:registro.responsable,
            motivo:registro.motivo
        });
    }

    async update(serie:string, folio:number, datos:Partial<Viaje>, detalles?:Partial<DetalleViaje>[], registrable?:registrable){
        try {
            const viaje = (await this.read({serie, folio}))[0];
            if(viaje['mensaje']!==undefined)return viaje;
            const self = this;
            async function setEvent(key:keyof Viaje){
                await self.fireRegister(viaje,key,registrable);
            }            
            async function compare(key:keyof Viaje){
                if(datos[key] !==undefined){
                    if(registrable)await setEvent(key);
                    viaje[key.toString()] = datos[key]
                }
            }
            //console.log('datos');
            //console.log(datos);
            //console.log(registrable);
            const keys = Object.keys(viaje);
            for(const index in keys){
                await compare(keys[index] as keyof Viaje)
            }
            if(detalles!== undefined){
                const originales = viaje.detalles.map(detalle=>detalle);
                for(const index in originales){
                    const detalle = originales[index];
                    detalles.forEach(nuevo=>{
                        if(detalle.serie===nuevo.serie&&detalle.folio===nuevo.folio){
                            if(nuevo.importe!==undefined)detalle.importe=nuevo.importe;
                            if(nuevo.horaEntrega!==undefined)detalle.horaEntrega=nuevo.horaEntrega;
                        }
                        //console.log(detalle)
                    })
                }
            }
            //console.log('viaje');
            //console.log(viaje);
            //await this.viajesRepo.save(viaje);
            return 'Viaje actualizado con exito';
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al actualizar el viaje, reportar a soporte técnico'}
        }
    }

    async getSeries(){
        return await this.serieRepo.createQueryBuilder('ser')
            .select('ser.serie')
            .getMany();
    }
    private querySinRelacion(bdname:'cdc'|'cmp'){
        const base = (()=>{
            if(bdname==='cdc')return process.env.DB_NAME_CDC;
            if(bdname==='cmp')return process.env.DB_NAME_CMP;
        })()
        return `SELECT CSERIEDOCUMENTO, CFOLIO, CTOTAL, CFECHA, (CASE 
            WHEN cli.CRFC = 'XAXX010101000' THEN cli.CTEXTOEXTRA3 ELSE cli.CRAZONSOCIAL END) AS NOMBRE
        FROM ${base}.dbo.admDocumentos doc
        LEFT JOIN ${base}.dbo.admClientes cli ON doc.CIDCLIENTEPROVEEDOR = cli.CIDCLIENTEPROVEEDOR
        LEFT JOIN ${base}.dbo.admClasificacionesValores val ON cli.CIDVALORCLASIFCLIENTE1 = val.CIDVALORCLASIFICACION
        WHERE CIDDOCUMENTODE = 4
        AND CCANCELADO = 0
        AND val.CCODIGOVALORCLASIFICACION != 'INT'`
    }
    async getSinRelacion(){
        const querySinRelacion = `SELECT facs.CSERIEDOCUMENTO AS serie
            ,facs.CFOLIO AS folio
            ,facs.CTOTAL AS  total
            ,facs.CFECHA AS expedicion 
            ,facs.NOMBRE as nombre
        FROM (
            ${this.querySinRelacion('cdc')}
            UNION
            ${this.querySinRelacion('cmp')}
        ) facs
        LEFT JOIN [dbo].[Detalle_Viaje] det ON det.Serie = facs.CSERIEDOCUMENTO AND det.Folio = facs.CFOLIO
        LEFT JOIN [dbo].[Facturas_Cerradas] cer ON cer.Serie = facs.CSERIEDOCUMENTO AND cer.Folio = facs.CFOLIO
        WHERE (det.Serie  IS NULL AND det.Folio IS NULL)
        AND (cer.Serie  IS NULL AND cer.Folio IS NULL)
        AND (CFECHA <= (GETDATE()-5) AND CFECHA >= (GETDATE()-30))`
        try {
            return  await this.viajesRepo.query(querySinRelacion)
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al obtener las facturas sin relacion. Reportar a soporte tecnico'}
        }
    }
}
