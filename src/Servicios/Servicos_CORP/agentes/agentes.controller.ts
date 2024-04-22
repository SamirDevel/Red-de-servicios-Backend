import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { AgentesService } from './agentes.service';
import { CorpListInterceptor } from 'src/interceptors/corp.interceptor';
import * as fns from '../../../estructuras_y_algoritmos/funciones'

@Controller('agentes')
export class AgentesController {
    constructor(private agentesService:AgentesService){}

    @UseInterceptors(CorpListInterceptor)
    @Get('/:tipo/:empresa')
    async getAgentes(@Param('tipo') tipo:string, @Param('empresa') empresa:string){
        try {
            fns.validarEmpresa(empresa)
            let lista:any[] = null
            if(tipo==='agentes'){
                lista = await this.agentesService.getListAgente(empresa);
                lista = lista.filter(item=>item['estatus']==='ACTIVO')
            }
            else if(tipo==='operadores')lista = await this.agentesService.getListChofer(empresa);
            else if(tipo==='vehiculos')lista = await this.agentesService.getListVehiculo(empresa);
            else throw new Error('El tipo seleccionado no es correcto')
            return {lista,
                compare:(item1, item2)=>item1['nombre'] < item2['nombre'],
                fusion:(item1,item2)=>{
                    return item1['nombre'] === item2['nombre']
                }
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return JSON.stringify({ error: errorMessage });
        }
    }
}
