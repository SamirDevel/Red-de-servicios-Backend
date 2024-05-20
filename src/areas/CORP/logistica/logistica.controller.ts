import { Controller, Get, Query } from '@nestjs/common';
import ConsultaViajeDTO from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/DTOS/viaje.filtros.dto';
import { LogisticaService } from './logistica.service';

@Controller('logistica')
export class LogisticaController {
    constructor(
    private serVlogistica:LogisticaService
    ){}
    @Get('viajes/consulta')
    async getViajes(@Query() query:ConsultaViajeDTO){
        return await this.serVlogistica.getViajes(query)
    }
}
