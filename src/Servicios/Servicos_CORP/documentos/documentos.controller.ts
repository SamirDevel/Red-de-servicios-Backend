import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
//DTOS
import DocumentoCLienteDto from './DTOS/documeto.cliente.dto';
import DocumentosDTO from './DTOS/documentos.filtros.dto';
//Dependencias
import { DocumentosService } from './documentos.service';
import { empresa } from 'src/entidades/entidadesCORP/tiposDatos';
import { CorpOneInterceptor, CorpListInterceptor } from 'src/interceptors/corp.interceptor';
import * as fns from '../../../estructuras_y_algoritmos/funciones'
import ListaCorp from 'src/estructuras_y_algoritmos/lista.corp';

@Controller('documentos')
export class DocumentosController {
    constructor(private docService:DocumentosService){}
    
    @UseInterceptors(CorpOneInterceptor)
    @Get('/documento/:empresa/:serie/:folio')
    async getDoc(@Param('empresa') empresa:empresa, @Param('serie') serie:string, @Param('folio') folio:number, @Query() query:DocumentoCLienteDto){
        return await fns.validar(async ()=>{
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
        },empresa)
    }
    
    @UseInterceptors(CorpListInterceptor)
    @Get('/:empresa')
    async getDocs(@Param('empresa') empresa:empresa, @Query() filtros:DocumentosDTO){
       return await fns.validar(async ()=>{
        if(filtros.fechaIS!==undefined)filtros.fechaI = fns.validarFecha(filtros.fechaIS);
        if(filtros.fechaFS!==undefined)filtros.fechaF = fns.validarFecha(filtros.fechaFS);
        const clientFlag = fns.validatorBool(filtros.cliente, 'cliente')
        let builder = await this.docService.getList(empresa, filtros);
        if(clientFlag===true){
            builder =  await this.docService.clientData(builder)
            const domFlag = fns.validatorBool(filtros.dom, 'dom')
                if(domFlag===true)
                    builder = await this.docService.domData(builder);
        }
        if(filtros.agente!==undefined)
            builder = await this.docService.agentData(builder);
        const lista = new ListaCorp(await builder.getMany());
        if(clientFlag!==undefined&&filtros.ruta!==undefined){
            return lista.filter((item)=>{
                return item['idCliente']['ruta'] === filtros.ruta;
            }).elementos
        }
        //console.log(lista[0]['idCliente']);
        return {lista: lista.elementos,
            compare:(item1, item2)=>item1['nombre'] < item2['nombre'],
            fusion:(item1,item2)=>item1['nombre'] === item2['nombre']
        };
       }, empresa)
    }

    @UseInterceptors(CorpListInterceptor)
    @Get('/series/:empresa/')
    async getSeries(@Param('empresa') empresa:empresa,){
        try {
            fns.validarEmpresa(empresa)
            return {lista:await this.docService.getSeries(empresa),
                compare:(item1, item2)=>item1['nombre'] < item2['nombre'],
                fusion:(item1,item2)=>item1['nombre'] === item2['nombre']
            }
        }catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return JSON.stringify({ error: errorMessage });
       }
    }

    @UseInterceptors(CorpListInterceptor)
    @Get('/rutas/:empresa/')
    async getRutas(@Param('empresa') empresa:empresa,){
        try {
            fns.validarEmpresa(empresa)
            return {lista: await this.docService.getRutas(empresa),
                compare:(item1, item2)=>item1['nombre'] < item2['nombre'],
                fusion:(item1,item2)=>item1['nombre'] === item2['nombre']
            }
        }catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return JSON.stringify({ error: errorMessage });
       }
    }
}
