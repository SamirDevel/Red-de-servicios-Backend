import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { CreditoCobranzaService } from './credito.cobranza.service';
import DocumentosDTO from 'src/Servicos_CORP/documentos/DTOS/documentos.filtros.dto';
import { empresa } from 'src/entidades/tiposDatos';
import { CorpOneInterceptor, CorpListInterceptor } from 'src/corp.interceptor';
import * as fns from '../../funciones'
import ListaCorp from 'src/estructuras_y_algoritmos/lista.corp';


@Controller('credito.cobranza')
export class CreditoCobranzaController {
    constructor(private cycService:CreditoCobranzaService){ }
    @UseInterceptors(CorpOneInterceptor)
    @Get('/documento/:empresa/:serie/:folio')
    async getDoc(@Param('empresa') empresa:empresa, @Param('serie') serie:string, @Param('folio') folio:number){
        return await fns.validar(async ()=>{
            const builder = await this.cycService.getOne(empresa, serie, folio);
            return builder.getOne()
        },empresa)
    }
    
    @UseInterceptors(CorpListInterceptor)
    @Get('/pendientes/:empresa')
    async getDocs(@Param('empresa') empresa:empresa, @Query() filtros:DocumentosDTO){
        return await fns.validar(async ()=>{
        if(filtros.fechaIS!==undefined)filtros.fechaI = fns.validarFecha(filtros.fechaIS);
        if(filtros.fechaFS!==undefined)filtros.fechaF = fns.validarFecha(filtros.fechaFS);
        if(filtros.restanteIS!==undefined)filtros.restanteI = fns.validarNumero(filtros.restanteIS);
        if(filtros.restanteFS!==undefined)filtros.restanteF = fns.validarNumero(filtros.restanteFS);
        const lista = await this.cycService.getList(empresa, filtros);
        
        //console.log(lista[0]['idCliente']);
        return {lista, 
            compare:(item1, item2)=>true, 
            fusion:(item1, item2)=>false};
       }, empresa)
    }

    @Get('/cobranza.total/:empresa/:fechaIS/:fechaFS')
    async getCobranzaTotal(@Param('empresa') empresa:empresa, @Param('fechaIS') fechaIS:string,  @Param('fechaFS') fechaFS:string, @Query() filtros:DocumentosDTO){
        return await fns.validar(async ()=>{
            filtros.fechaI = fns.validarFecha(fechaIS);
            filtros.fechaF = fns.validarFecha(fechaFS);
            if(filtros.fechaI>filtros.fechaF)
                throw new Error('El periodo seleccionado es invalido');
            
                return await this.cycService.cobranzaTotal(empresa, filtros);
        }, empresa)
    }
}
