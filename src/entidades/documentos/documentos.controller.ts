import {Body, Controller, Get, Param } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { empresa } from '../tiposDatos';
@Controller('documentos')
export class DocumentosController {
    constructor(private documentosService:DocumentosService){}
    
    @Get('/todos/:empresa')
    listar(@Param('empresa') empresa:empresa){
        return this.documentosService.list(empresa);
    }
}
