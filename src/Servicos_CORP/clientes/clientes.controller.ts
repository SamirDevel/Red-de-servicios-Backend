import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
///DTOS
import CLienteDomicilioDto from './DTOS/cliente.direccion.dto';
import { ClientesService } from './clientes.service';
import { empresa } from 'src/entidades/tiposDatos';
import { CorpListInterceptor } from 'src/corp.interceptor';
import * as fns from '../../funciones'

@Controller('clientes')
export class ClientesController {
    constructor(private clientesService:ClientesService){}

    @Get('/cliente/:empresa/:codigo')
    async getCliente(@Param('empresa') empresa:empresa, @Param('codigo') codigo:string, @Query() query:CLienteDomicilioDto){
        try {
            fns.validarEmpresa(empresa)
            const clientFlag = fns.validatorBool(query.domicilio, 'domicilio')
            let builder = await this.clientesService.getOne(empresa, codigo);
            builder = (clientFlag===true?await this.clientesService.domData(builder):builder);
            return builder.getOne()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';;
            return JSON.stringify({ error: errorMessage });
        }
    }

    @UseInterceptors(CorpListInterceptor)
    @Get('/:empresa/')
    async getClientes(@Param('empresa') empresa:empresa){
        try {
            fns.validarEmpresa(empresa);
            const lista = await this.clientesService.getAll(empresa);
            return {lista, 
                compare:(item1, item2)=>item1['nombre'] < item2['nombre'],
                fusion:(item1,item2)=>item1['nombre'] === item2['nombre']
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';;
            return JSON.stringify({ error: errorMessage });
        }
    }

    @UseInterceptors(CorpListInterceptor)
    @Get('/clasificaciones/:empresa/')
    async getClasificacionesClientes(@Param('empresa') empresa:empresa){
        try {
            fns.validarEmpresa(empresa);
            const lista = await this.clientesService.getClasificaciones(empresa);
            //console.log(lista);
            return {lista,
                compare:(item1, item2)=>item1['nombre'] < item2['nombre'],
                fusion:(item1,item2)=>item1['nombre'] === item2['nombre']
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';;
            return JSON.stringify({ error: errorMessage });
        }
    }
}
