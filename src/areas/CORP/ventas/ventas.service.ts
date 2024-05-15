import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Documento from 'src/entidades/entidadesCORP/documentos.entity';

interface filtros{
    fechaI:Date
    fechaF:Date

}
@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(Documento,'cdc') private repoDocCDC:Repository<Documento>,
        @InjectRepository(Documento,'cmp') private repoDocCMP:Repository<Documento>
    ){}

    private getRepo(empresa:string){
        if(empresa==='cdc')return this.repoDocCDC
        if(empresa==='cmp')return this.repoDocCMP
        return null;
    }

    private getDescuentos(){
        return `(mov.descuento1 + mov.descuento2 + mov.descuento3 + mov.descuento4 + mov.descuento5)`
    }
    async getVentasPeriodo(empresa:string, filtros:Partial<filtros>){
        const repo = this.getRepo(empresa);
        if(repo===null)return {mensaje:'La seleccion de empresa no es valida'}
        else{
            try {
                const query = repo.createQueryBuilder('doc')
                    .select('doc.serie', 'serie')
                    .addSelect('doc.folio', 'folio')
                    .addSelect('doc.expedicion', 'expedicion')
                    .addSelect('cli.codigo', 'codigoCliente')
                    .addSelect('cli.nombre', 'nombreCliente')
                    .addSelect('cli.rfc', 'rfc')
                    .addSelect('age.nombre', 'nombreAgente')
                    .addSelect('cli.ruta', 'ruta')
                    .addSelect('pro.codigo', 'codigoProducto')
                    .addSelect('pro.nombre', 'nombreProducto')
                    .addSelect('pro.familia', 'familia')
                    .addSelect('mov.unidadesCapturadas', 'unidadesCapturadas')
                    .addSelect('(mov.costoEspecifico / mov.unidadesCapturadas)', 'costoUnitario')
                    .addSelect('mov.costoEspecifico', 'costoEspecifico')
                    .addSelect(`(mov.neto - ${this.getDescuentos()})/ mov.unidadesCapturadas`, 'precioUnitario')
                    .addSelect(`mov.neto - ${this.getDescuentos()}`, 'subTotal')

                    .leftJoin('doc.idCliente', 'cli')
                    .leftJoin('doc.idAgente', 'age')
                    .leftJoin('doc.movimientos', 'mov')
                    .leftJoin('mov.idProducto', 'pro')

                    .andWhere('doc.idModelo = 4')

                if(filtros.fechaI!==undefined){
                    const fechaI = new Date(filtros.fechaI)
                    fechaI.setUTCHours(0, 0, 0, 0);
                    query.andWhere('doc.expedicion >= :fechaI', {fechaI})
                }
                if(filtros.fechaF!==undefined){
                    const fechaF = new Date(filtros.fechaF)
                    fechaF.setUTCHours(23, 59, 59, 999);
                    query.andWhere('doc.expedicion <= :fechaF', {fechaF})
                }
                return await query.getRawMany();
            } catch (error) {
                console.log(error)
                return {mensaje:'Algo salio mal durante la consulta, reportar a soporte tecnico.'}
            }
        }
    }

}