import { Controller, Get, Param, Query } from '@nestjs/common';
///DTOS
import { DomiciliosService } from './domicilios.service';
import { empresa } from 'src/entidades/tiposDatos';
import * as fns from '../../funciones'

@Controller('domicilios')
export class DomiciliosController {
    constructor(private domService:DomiciliosService){}

    @Get('/:empresa/todos')
    async getDocs(@Param('empresa') empresa:empresa){
        try {
            fns.validarEmpresa(empresa)
            let builder = await this.domService.getAll(empresa);
            console.log(await builder.getMany())
            return await builder.getMany()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';;
            return JSON.stringify({ error: errorMessage });
        }
    }
}
