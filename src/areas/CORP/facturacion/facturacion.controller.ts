import { Controller, Get, Param, Query, Post, Body, UseGuards, Delete, Patch } from '@nestjs/common';
import { mixinPermission } from 'src/interceptors/sessions interceptors/permission.guard';
import { FacturacionService } from './facturacion.service';
import ViajeSalidaDTO from './DTOs/viaje.salida.dto';
import ConsultaViajeDTO from '../../../Servicios/Servicos_Desarrollo/viajes/vehiculo/DTOS/viaje.filtros.dto';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';

@UseGuards(mixinPermission('FTC'))
@Controller('facturacion')
export class FacturacionController {
    constructor(
        private facService:FacturacionService,
        private viaService:ViajesService,
    ){}

    @Get('/documento/:empresa/:serie/:folio')
    async getFactura(@Param('empresa') empresa:string, @Param('serie') serie:string, @Param('folio') folio:number){
        return await this.facService.getDoc(empresa, serie, folio);
    }

    //Viajes
    @Get('/viaje/head/:empresa')
    async getViajeHead(@Param('empresa') empresa:'cdc'|'cmp'){
        return await this.viaService.getHead(empresa);
    }
    @Post('/viajes/crear/:empresa')
    async createViaje(@Body() body:ViajeSalidaDTO){
        return await this.facService.crearViaje(body);
    }
    @Get('viajes/consulta')
    async getViajes(@Query() query:ConsultaViajeDTO){
        return await this.facService.getViajes(query)
    }

    //clientes
    @Post()
    insertCliente(){
        try {
            
        } catch (error) {
            console.log(error);
        }
    }
}
