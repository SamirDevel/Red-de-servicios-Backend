import { Controller, Get, Param, Query } from '@nestjs/common';
///DTOS
import CLienteDomicilioDto from './DTOS/cliente.direccion.dto';
import { ClientesService } from './clientes.service';
import { empresa } from 'src/entidades/tiposDatos';
import * as fns from '../../funciones'

@Controller('clientes')
export class ClientesController {
    constructor(private clientesService:ClientesService){}

    @Get('/cliente/:empresa/:codigo')
    async getDoc(@Param('empresa') empresa:empresa, @Param('codigo') codigo:string, @Query() query:CLienteDomicilioDto){
        try {
            const clientFlag = fns.validatorBool(query.domicilio, 'domicilio')
            let builder = await this.clientesService.getOne(empresa, codigo);
            builder = (clientFlag===true?await this.clientesService.domData(builder):builder);
            return builder.getOne()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';;
            return JSON.stringify({ error: errorMessage });
        }
    }
}
