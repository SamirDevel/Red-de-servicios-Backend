import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { mixinPermission } from 'src/interceptors/sessions interceptors/permission.guard';
import { VentasService } from './ventas.service';
import VentasPeriodoDTO from './DTOs/ventas.periodo.dto';
import { CorpListInterceptor } from 'src/interceptors/corp.interceptor';

@UseGuards(mixinPermission('VNT'))
@Controller('ventas')
export class VentasController {
    constructor(
        private serviceVentas:VentasService
    ) {}

    @UseInterceptors(CorpListInterceptor)
    @Get('/periodo/:empresa')
    async ventasPeriodo(@Query() query:VentasPeriodoDTO, @Param('empresa') empresa:string){
        const result = await this.serviceVentas.getVentasPeriodo(empresa, query);
        //console.log(typeof result)
        //console.log(result)
        return {lista:result, 
            compare:(item1, item2)=>true, 
            fusion:(item1, item2)=>false
        };
    }
    
}
