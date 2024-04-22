import { Controller, Get, Param, Query, Post, Body, UseGuards, Delete, Patch } from '@nestjs/common';
import { ViajesService } from './viajes.service';
import { ChoferService } from './chofer/chofer.service';
import { VehiculoService } from './vehiculo/vehiculo.service';
import EstatusDTO from './vehiculo/DTOS/estatus.dto';

@Controller('viajes')
export class ViajesController {
    constructor(
        private viaService:ViajesService,
        private vehService:VehiculoService,
        private choService:ChoferService,
    ){}
    @Get('/series')
    async getSeries(){
        return this.viaService.getSeries();
    }
    @Get('/choferes')
    async getAgentes(@Query() query:EstatusDTO){
        return await this.choService.getList(query.estatus);
    }
    @Get('/vehiculos')
    async getVehiculos(@Query() query:EstatusDTO){
        return await this.vehService.getListExtended(query.estatus);
    }
}
