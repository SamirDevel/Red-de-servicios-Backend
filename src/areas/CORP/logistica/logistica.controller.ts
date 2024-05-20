import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import ConsultaViajeDTO from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/DTOS/viaje.filtros.dto';
import { LogisticaService } from './logistica.service';
import { UseInterceptors } from '@nestjs/common';
import { CorpOneInterceptor } from 'src/interceptors/corp.interceptor';
import { CreditoCobranzaService } from '../credito.cobranza/credito.cobranza.service';
import { fns } from 'src/estructuras_y_algoritmos/funciones';
import { FacturacionService } from '../facturacion/facturacion.service';
import ViajeSalidaDTO from '../facturacion/DTOs/viaje.salida.dto';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';

@Controller('logistica')
export class LogisticaController {
    constructor(
        private serLGT:LogisticaService,
        private serCYC:CreditoCobranzaService,
        private serFCT:FacturacionService,
        private serViajes:ViajesService
    ){}

    @UseInterceptors(CorpOneInterceptor)
    @Get('/documento/:empresa/:serie/:folio')
    async getDocumento(@Param('empresa') empresa:'cdc'|'cmp', @Param('serie') serie:string, @Param('folio') folio:number){
        return await fns.validar(async ()=>{
            const builder = await this.serCYC.getOne(empresa, serie, folio);
            const observacion = this.serCYC.getCometario({serie,folio:folio.toString()})
            const factura = await builder.getOne;
            return observacion!==null?{...factura, observacion}:factura;
        },empresa)
    }
    //#region viajes
    @Get('viajes/consulta')
    async getViajes(@Query() query:ConsultaViajeDTO){
        return await this.serLGT.getViajes(query)
    }
    @Get('/viaje/head/:empresa')
    async getViajeHead(@Param('empresa') empresa:'cdc'|'cmp'){
        return await this.serViajes.getHead(empresa);
    }
    @Post('/viajes/crear/:empresa')
    async createViaje(@Body() body:ViajeSalidaDTO){
        return await this.serFCT.crearViaje(body);
    }
    //#endregion

}
