import { Controller, Get, Param, Query, Post } from '@nestjs/common';

import { FacturacionService } from './facturacion.service';
import { empresa } from 'src/entidades/tiposDatos';
import * as fns from '../../funciones'


@Controller('facturacion')
export class FacturacionController {
    constructor(private facService:FacturacionService){}

    @Post()
    insertCliente(){
        try {
            
        } catch (error) {
            console.log(error);
        }
    }
}
