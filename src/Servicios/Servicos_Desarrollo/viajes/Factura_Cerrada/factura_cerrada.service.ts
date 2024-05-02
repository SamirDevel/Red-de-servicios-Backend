import { Injectable } from '@nestjs/common';
import { EntityMetadata, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import FacturaCerrada from 'src/entidades/entidadesDesarrollos/Viajes/facturas.cerradas';
import { fns } from 'src/estructuras_y_algoritmos/funciones';

interface cerrarFactura{
    serie:string
    folio:number
    motivo:string
    fechaI?:Date
    fechaF?:Date
}

@Injectable()
export class FacturaCerradaService {
    constructor(
        @InjectRepository(FacturaCerrada, 'viajes') private facturaCerradaRepo:Repository<FacturaCerrada>,
    ) {}

    async create(nuevo:cerrarFactura){
        const cerrada = this.facturaCerradaRepo.create({
            ...nuevo,
            fecha:fns.getToday()});
        try {
            //console.log(cerrada);
            await this.facturaCerradaRepo.save(cerrada);
            return 'Factura cerrada Exitosamente. ';
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al cerrar la factura, reportar a soporte técnico'}
        }
    }
    async read(filtros?:Partial<cerrarFactura>){
        try {
            const query = this.facturaCerradaRepo.createQueryBuilder('cer')
                .select()
            if(filtros.serie!==undefined)
                query.andWhere('cer.serie = :serie', {serie:filtros.serie})
            if(filtros.folio!==undefined)
                query.andWhere('cer.folio = :folio', {folio:filtros.folio})
            return await query.getMany();
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al consultas las facturas cerradas, reportar a soporte técnico'}
        }
    }

    async update(serie:string, folio:number, motivo:string){
        try {
            //console.log();
            const factura = (await this.read({serie, folio}))[0]
            factura.motivo = motivo;
            await this.facturaCerradaRepo.save(factura);
            return 'Factura actualizada Exitosamente. ';
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al cerrar la factura, reportar a soporte técnico'}
        }
    }

}
