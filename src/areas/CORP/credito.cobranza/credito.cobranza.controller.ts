import { Controller, Get, Post, Patch, Body, Param, Query, UseInterceptors, UseGuards} from '@nestjs/common';
import { CreditoCobranzaService } from './credito.cobranza.service';
import cycDTO from './DTOS/cyc.dto';
import { empresa } from 'src/entidades/entidadesCORP/tiposDatos';
import { CorpOneInterceptor, CorpListInterceptor } from 'src/interceptors/corp.interceptor';
import * as fns from '../../../estructuras_y_algoritmos/funciones'
import { mixinPermission } from 'src/interceptors/sessions interceptors/permission.guard';
import { VentasService } from 'src/Servicios/Servicos_Desarrollo/ventas/ventas.service';
import ConsultaViajeDTO from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/DTOS/viaje.filtros.dto';
import ViajeLlegadaDTO from './DTOS/viaje.llegada.dto';
import CancelarViajeDTO from './DTOS/cancelar.viaje.dto';
import CrearMotivoDTO from '../almacen.inventario/DTO/crear.motivo.dto';
import { AgenteDesService } from 'src/servicios/servicos_desarrollo/agente-des/agente-des.service';
import ActualizarViajeDTO from './DTOS/actualizar.viaje.dto';
import CerrarFacturaDTO from './DTOS/cerrar.factura.dto';

@UseGuards(mixinPermission('CYC'))
@Controller('credito.cobranza')
export class CreditoCobranzaController {
    constructor(
        private cycService:CreditoCobranzaService,
        private ventasService:VentasService,
        private ageDesService:AgenteDesService
    ){ }
    
    @UseInterceptors(CorpOneInterceptor)
    @Get('/documento/:empresa/:serie/:folio')
    async getDoc(@Param('empresa') empresa:empresa, @Param('serie') serie:string, @Param('folio') folio:number){
        return await fns.validar(async ()=>{
            const builder = await this.cycService.getOne(empresa, serie, folio);
            const observacion = this.cycService.getCometario({serie,folio:folio.toString()})
            const factura = await builder.getOne;
            return observacion!==null?{...factura, observacion}:factura;
        },empresa)
    }
    
    @UseInterceptors(CorpListInterceptor)
    @Get('/pendientes/:empresa')
    async getDocs(@Param('empresa') empresa:empresa, @Query() filtros:cycDTO){
        return await fns.validar(async ()=>{
        if(filtros.fechaIS!==undefined)filtros.fechaI = fns.validarFecha(filtros.fechaIS);
        if(filtros.fechaFS!==undefined)filtros.fechaF = fns.validarFecha(filtros.fechaFS);
        if(filtros.restanteIS!==undefined)filtros.restanteI = fns.validarNumero(filtros.restanteIS);
        if(filtros.restanteFS!==undefined)filtros.restanteF = fns.validarNumero(filtros.restanteFS);
        const lista = await this.cycService.getList(empresa, filtros);
        
        return {lista, 
            compare:(item1, item2)=>true, 
            fusion:(item1, item2)=>false};
       }, empresa)
    }

    private rangoFecha(fechaIS, fechaFS){
        try {
            const fechaI = fns.validarFecha(fechaIS);
            const fechaF = fns.validarFecha(fechaFS);
            if(fechaI>fechaF)
                throw new Error('El periodo seleccionado es invalido');
            return {fechaI, fechaF}
        } catch (error) {
            return error
        }
    }

    @Get('/cobranza.total/:empresa/:fechaIS/:fechaFS')
    async getCobranzaTotal(@Param('empresa') empresa:empresa, @Param('fechaIS') fechaIS:string,  @Param('fechaFS') fechaFS:string, @Query() filtros:cycDTO){
        return await fns.validar(async ()=>{
            filtros.fechaI = new Date(fechaIS);
            filtros.fechaF = new Date(fechaFS);
            try {
                if(filtros.concepto==='cobrado')return await this.ventasService.cobrado(empresa,filtros);
                if(filtros.concepto==='a_tiempo')return await this.ventasService.aTiempo(empresa,filtros);
                if(filtros.concepto==='no_a_tiempo')return await this.ventasService.fueraTiempo(empresa,filtros);
                if(filtros.concepto==='no_cobrado')return await this.ventasService.pendiente(empresa,filtros);
                return await this.ventasService.cobranzaTotal(empresa, filtros)
            } catch (error) {
                console.log(error);
            }
        }, empresa)
    }

    @Get('/cartera.vencida/:empresa/:fechaIS/:fechaFS')
    async getCarteraVencida(@Param('empresa') empresa:empresa, @Param('fechaIS') fechaIS:string,  @Param('fechaFS') fechaFS:string, @Query() filtros:cycDTO){
        return await fns.validar(async ()=>{
            const {fechaI, fechaF}=this.rangoFecha(fechaIS, fechaFS)
            filtros.fechaI = fechaI;
            filtros.fechaF = fechaF;
            //if(filtros.concepto==='inicial')return await this.ventasService.cobrado(empresa,filtros);
            if(filtros.concepto==='cobrado')return await this.ventasService.recuperado(empresa,filtros);
            if(filtros.concepto==='cancelado')return await this.ventasService.cancelado(empresa,filtros);
            if(filtros.concepto==='final')return await this.ventasService.deudaFinal(empresa,filtros);
            //console.log(result)
            //return await this.cycService.carteraVencida(empresa, filtros);
            return await this.ventasService.CarteraVencida(empresa,filtros);
        }, empresa)
    }

    @Get('/promedios/:empresa/:fechaIS/:fechaFS')
    async getPromedios(@Param('empresa') empresa:empresa, @Param('fechaIS') fechaIS:string,  @Param('fechaFS') fechaFS:string, @Query() filtros:cycDTO){
        return await fns.validar(async ()=>{
            const {fechaI, fechaF}=this.rangoFecha(fechaIS, fechaFS)
            filtros.fechaI = fechaI;
            filtros.fechaF = fechaF;
            return await this.cycService.promedios(empresa, filtros);
        }, empresa)
    }

    @Get('/ignoradas')
    async getIgnoradas(){
        return this.cycService.getApendices('excluidas');
    }

    @Post('/igonar/:serie/:folio')
    async setIgnorada(@Param('serie') serie:string, @Param('folio') folio:string){
        return this.cycService.setIgnorada({serie,folio})   
    }

    @Post('/reincorporar')
    async quitIgnoradas(@Body() body:any[]){
        this.cycService.reincorporarIgnoradas(body)
        return await this.getIgnoradas();
    }

    @UseInterceptors(CorpOneInterceptor)
    @Post('/modificar/:empresa/:serie/:folio')
    async modificarCliente(@Body() body:any, @Param('empresa') empresa:empresa, @Param('serie') serie:string, @Param('folio') folio:number){
        return await this.cycService.modificarCliente(empresa, serie,folio, body);   
    }
    //#region Viajes
    @Get('viajes/consulta')
    async getViajes(@Query() query:ConsultaViajeDTO){
        return await this.cycService.getViajes(query)
    }
    @Post('viajes/completar/:serie/:folio')
    async closeViaje(@Param('serie') serie:string, @Param('folio') folio:number, @Body() body:ViajeLlegadaDTO){
        return await this.cycService.closeViajes(serie, folio, body)
    }
    @Post('viajes/cancelar/:serie/:folio')
    async cancelViaje(@Param('serie') serie:string, @Param('folio') folio:number, @Body() body:CancelarViajeDTO){
        return await this.cycService.cancelViajes(serie, folio, body)
    }
    @Patch('viajes/modificar/:serie/:folio')
    async updateViaje(@Param('serie') serie:string, @Param('folio') folio:number, @Body() body:ActualizarViajeDTO){
        return await this.cycService.updateViajes(serie, folio, body)
    }
    @Get('viajes/:evento/motivos')
    async getMotivosCancelacion(@Param('evento') evento:string){
        return await this.cycService.getMotivos(evento)
    }
    @Post('viajes/motivos/crear/:evento')
    async createMotivo(@Param('evento') evento:string, @Body() body:CrearMotivoDTO){
        return await this.cycService.setMotivo(evento, body)
    }
    @Get('viajes/facturas/sin_relacion')
    async getSinRelacion(){
        return await this.cycService.getFacturasSinRelacion();
    }
    @Post('viajes/factura/cerrar/:serie/:folio')
    async cerrarFactura(@Param('serie') serie:string, @Param('folio') folio:string, @Body() body:CerrarFacturaDTO){
        try {
            return await this.cycService.cerrarFactura(serie,parseInt(folio),body.motivo)   
        } catch (error) {
            console.log(error)
            return {mensaje:'Posiblemente algun parametro para cerrar la factura está equivocado. Intentelo de nuevo'}
        }
    }
    //#endregion
    @Get('/agentes/todos')
    async getAgentes(){
        return await this.ageDesService.list();
    }
    //dias festivos

}
