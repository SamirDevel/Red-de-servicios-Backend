import { Injectable } from '@nestjs/common';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Documento from 'src/entidades/entidadesCORP/documentos.entity';
import ValidacionPickingDTO from './DTO/validacion.dto';

@Injectable()
export class AlmacenInventarioService {
    constructor (
        @InjectRepository(Documento, 'cdc') private RepoCDC:Repository<Documento>,
        @InjectRepository(Documento, 'cmp') private RepoCMP:Repository<Documento>,
    ){}

    private getRepo(empresa:string){
        if(empresa==='cdc') return this.RepoCDC
        if(empresa==='cmp') return this.RepoCMP
        return null
    }

    async consultarDocs(empresa:string, fechaI:string, fechaF:string, documento:string, filtros:ValidacionPickingDTO){
        const repo = this.getRepo(empresa);
        const modelo = (()=>{
            if(documento==='picking')return 3;
            if(documento==='devolucion')return 7;
            return null;
        })();
        if(modelo===null)return {mensaje:'Debe seleccionar un tipo de documento'}
        if(repo!==null){
            try {
                const query = repo.createQueryBuilder('doc')
                    .select('doc.expedicion', 'expedicion')
                    .addSelect('doc.serie', 'serie')
                    .addSelect('cli.nombre', 'nombre')
                    .addSelect('doc.folio', 'folio')
                    .addSelect('doc.razonSocial', 'razonSocial')
                    .addSelect('doc.total', 'total')
                    .addSelect('doc.cancelado', 'cancelado')
                    .addSelect('doc.unidadesPendientes', 'unidadesPendientes')
                    .addSelect(`SUM(mov.costoEspecifico)`, 'costo')
                    .addSelect(`pro.calsificacion1`,'calsificacion1')
                    .leftJoin('doc.movimientos', 'mov')
                    .leftJoin('mov.idProducto', 'pro')
                    .leftJoin('doc.idCliente', 'cli')
                    .where(`doc.idConcepto = ${modelo}`)
                    .andWhere('doc.expedicion >= :fechaI', {fechaI})
                    .andWhere('doc.expedicion <= :fechaF', {fechaF})
                    .groupBy('doc.expedicion')
                    .addGroupBy('doc.serie')
                    .addGroupBy('doc.folio')
                    .addGroupBy('doc.razonSocial')
                    .addGroupBy('doc.total')
                    .addGroupBy('doc.cancelado')
                    .addGroupBy('doc.unidadesPendientes')
                    .addGroupBy('pro.calsificacion1')
                    .addGroupBy(`(CASE WHEN cli.CRFC = 'XAXX010101000' THEN cli.CTEXTOEXTRA3 ELSE cli.CRAZONSOCIAL END)`)
                if(filtros.estado!==undefined)query.andWhere('doc.cancelado = :estado', {estado:filtros.estado})
                if(filtros.folioI!==undefined)query.andWhere('doc.folio >= :folioI', {folioI:filtros.folioI})
                if(filtros.folioF!==undefined)query.andWhere('doc.folio <= :folioF', {folioF:filtros.folioF})
                if(filtros.pendienteI!==undefined)query.andWhere('doc.unidadesPendientes >= :pendienteI', {pendienteI:filtros.pendienteI})
                if(filtros.pendienteF!==undefined)query.andWhere('doc.unidadesPendientes <= :pendienteF', {pendienteF:filtros.pendienteF})
                if(filtros.costoI!==undefined)query.andWhere('SUM(mov.costoEspecifico) >= :costoI', {costoI:filtros.costoI})
                if(filtros.costoF!==undefined)query.andWhere('SUM(mov.costoEspecifico) <= :costoF', {costoF:filtros.costoF})
                if(filtros.razonS!==undefined)query.andWhere('(cli.razonSocial = :razonS OR cli.txt3 = :razonS)', {razonS:filtros.razonS})
                return await query.getRawMany();
            } catch (error) {
                console.log(error);
                return {mensaje:'Algo salio mal consultando olos documentos, revise los parametros'};
            }
        }
        return {mensaje:'Empresa seleccionada no valida'};
    }
}
