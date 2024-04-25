import { Injectable } from '@nestjs/common';
import { EntityMetadata, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import FacturaCerrada from 'src/entidades/entidadesDesarrollos/Viajes/facturas.cerradas';
import { fns } from 'src/estructuras_y_algoritmos/funciones';

interface cerrarFactura{
    serie:string
    folio:number
    motivo:string
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
            console.log(cerrada);
            await this.facturaCerradaRepo.save(cerrada);
            return 'Factura cerrada Exitosamente. ';
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al cerrar la factura, reportar a soporte técnico'}
        }
    }
    async read(){
        
    }
    async update(){
        
    }

}
