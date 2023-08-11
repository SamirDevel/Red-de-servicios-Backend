import { Controller, Get, Param, Query } from '@nestjs/common';
//DTOS
import DocumentoCLienteDto from './DTOS/documeto.cliente.dto';
//Dependencias
import { DocumentosService } from './documentos.service';
import { empresa } from 'src/entidades/tiposDatos';
import * as fns from '../../funciones'

@Controller('documentos')
export class DocumentosController {
    constructor(private docService:DocumentosService){}

    @Get('/documento/:empresa/:serie/:folio')
    async getDoc(@Param('empresa') empresa:empresa, @Param('serie') serie:string, @Param('folio') folio:number, @Query() query:DocumentoCLienteDto){
        try {
            const clientFlag = fns.validatorBool(query.cliente, 'cliente')
            let builder = await this.docService.getOne(empresa, serie, folio);
            if(clientFlag===true){
                builder =  await this.docService.clientData(builder)
                const domFlag = fns.validatorBool(query.dom, 'dom')
                if(domFlag===true){
                    builder = await this.docService.domData(builder);
                }
            }
            return builder.getOne()
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return JSON.stringify({ error: errorMessage });
        }
    }
}
