import { Controller, Get, Param, Query, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RecursosHumanosService } from './recursos.humanos.service';
import RHAgente from './DTOS/rh.agente.dto';
import RHChofer from './DTOS/rh.chofer.dto';
import { empresa } from 'src/entidades/tiposDatos';
import * as fns from '../../funciones'

const inserUrlBase:string = '/crear/:empresa';
@Controller('rh')
export class RecursosHumanosController {
    constructor(private recHService:RecursosHumanosService){ }
    
    private insert(body:RHAgente|RHChofer, empresa:empresa){
        try {
            fns.validarEmpresa(empresa);
            const prefix = empresa==='cdc'?'CD':'CM';
            body['codigo'] = `${prefix}${body['codigo']}`;
            this.recHService.insertAgente(body);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            throw new HttpException(errorMessage,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post(`${inserUrlBase}/chofer`)
    insertChofer(@Body() body:RHChofer, @Param('empresa') empresa:empresa){
        this.insert(body, empresa);
    }

    @Post(`${inserUrlBase}/agente`)
    insertAgente(@Body() body:RHAgente, @Param('empresa') empresa:empresa){
        this.insert(body, empresa);
    }



}
