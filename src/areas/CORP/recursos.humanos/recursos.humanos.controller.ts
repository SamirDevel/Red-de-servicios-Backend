import { Controller, Get, Param, Query, Post, Body, UseGuards, Delete, Patch } from '@nestjs/common';
import { RecursosHumanosService } from './recursos.humanos.service';
import RHAgente from './DTOS/rh.agente.dto';
import RHChofer from './DTOS/rh.chofer.dto';
import RHRelacion from './DTOS/rh.relacon';
import RHAgenteDes from './DTOS/rh.agente.des.dto';
import { empresa } from 'src/entidades/entidadesCORP/tiposDatos';
import * as fns from '../../../estructuras_y_algoritmos/funciones'
import { mixinPermission } from 'src/interceptors/sessions interceptors/permission.guard';
import EsquemaDTO from '../recursos.humanos/DTOS/esquema.dto';
import { AgenteDesService } from 'src/servicios/servicos_desarrollo/agente-des/agente-des.service';
import { ComisionService } from 'src/Servicios/Servicos_Desarrollo/Comisiones/Comision.service';
import { VehiculoService } from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/vehiculo.service';
import { ChoferService } from 'src/Servicios/Servicos_Desarrollo/viajes/chofer/chofer.service';
import RHVehiculo from './DTOS/rh.vehiculo.dto';
import { EsquemasVehiculoService } from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/esquemas.vehiculo/esquemas.vehiculo.service';
import BonoChoferDTO from './DTOS/bono.chofer.dto';
import ComisionChoferDTO from './DTOS/registro.comision.chofer.dto';
import MetaCobranzaDTO from './DTOS/meta.cobranza.dto';
import GuardarComisionDTO from './DTOS/guardar.comision.dto';
import PenalizacionVentasDTO from './DTOS/penalizacion.comision.ventas.dto';

@UseGuards(mixinPermission('RH'))
@Controller('recursos.humanos')
export class RecursosHumanosController {
    constructor(
        private recHService:RecursosHumanosService,
        private ageDesService:AgenteDesService,
        private comisionService:ComisionService,
        private vehService:VehiculoService,
        private choService:ChoferService,
        private esqVehService:EsquemasVehiculoService,
    ){ }

    //agentes
    @Post(`crear/agente`)
    async insertAgente(@Body() body:RHAgente){
        return await this.recHService.insertAgente(body);
    }

    @Get('/agentes/todos')
    async getAgentes(){
        return await this.ageDesService.list();
    }

    @Get('/agentes/:codigo')
    async getAgente(@Param('codigo') codigo:string){
        return await this.ageDesService.getAgente(codigo);
    }

    @Patch('/agente/:codigo')
    async updateAgente(@Param('codigo') codigo:string, @Body() body:Partial<RHAgenteDes>){
        return await this.ageDesService.updateAgente({...body,codigo})
    }

    //relaciones
    @Get('/relaciones')
    async getRelations(){
        const lista = await this.recHService.getRelacionesAgentes();
        return lista
    }

    @Post('/relaciones')
    async setRelations(@Body() body:RHRelacion){
        return await this.recHService.setRelacionesAgentes(body.admin, body.dependiente)
    }

    @Delete('/relaciones/:admin/:dep')
    async deleteRelations(@Param('admin') admin:string, @Param('dep') dep:string){
        return await this.recHService.quitRelaconesAgentes(admin, dep)
    }

    //archivos comisiones
    @Get('/esquemas')
    async getEsquemas(@Query() query:any){
        return this.comisionService.getEsquemas(query.nombreEsquema)as any
    }

    @Get('/esquemas/nombres')
    async getEsquemasNombres(){
        return this.comisionService.getEsquemasNombres();
    }

    @Post('/esquemas')
    setEsquemas(@Body() body:EsquemaDTO[]){
        return this.comisionService.setEsquemas(body)
    }
    @Get('/bonos.chofer')
    async getBonosChofer(@Query() query:any){
        return this.comisionService.getBonos(query.nombreBono)as any
    }

    @Get('/bonos.chofer/nombres')
    async getBonosChoferNombres(){
        return this.comisionService.getBonosNombres();
    }

    @Post('/bonos.chofer')
    setBonosChofer(@Body() body:BonoChoferDTO[]){
        return this.comisionService.setBonos(body)
    }
    @Get('penalizaciones')
    async getPenalizaciones(){
        return await this.comisionService.getPenalizacion()
    }
    @Post('penalizaciones')
    setPenalizaciones(@Body() body:PenalizacionVentasDTO[]){
        return this.comisionService.setPenalizaciones(body)
    }
    @Get('/meta/ventas')
    getMeta(){
        return this.comisionService.getMeta()
    }
    @Post('/meta/ventas')
    setMeta(@Body() body:MetaCobranzaDTO){
        return this.comisionService.setMeta(body.meta)
    }

    //#region  comisiones
    @Get('/comisiones/ventas/:fechaI/:fechaF/:tipo')
    async getVentas(@Param('fechaI') fechaI:string, @Param('fechaF') fechaF:string, @Param('tipo') tipo:string){
        return await this.recHService.getRelacionesComision(fechaI, fechaF, parseInt(tipo))
    }

    @Get('/comisiones/ventas/:agente/:fechaI/:fechaF/:tipo')
    async getVentasOne(@Param('fechaI') fechaI:string, @Param('fechaF') fechaF:string, @Param('tipo') tipo:string, @Param('agente') agente:string){
        return await this.recHService.getRelacionesComision(fechaI, fechaF, parseInt(tipo), agente)
    }

    @Post('/comisiones/ventas/:fechaI/:fechaF')
    async setComisionesPagadas(@Param('fechaI') fechaI:string, @Param('fechaF') fechaF:string, @Body() body:GuardarComisionDTO[]){
        return await this.comisionService.saveRgistros(fechaI, fechaF, body)
    }

    @Get('/comision/ventas/:agente/:fechaI/:fechaF/:tipo')
    async getVentasAgente(@Param('fechaI') fechaI:string, @Param('fechaF') fechaF:string, @Param('agente') agente:string, @Param('tipo') tipo:string){
        return await this.comisionService.build(agente, fechaI, fechaF, parseInt(tipo))
        //return await this.recHService.getDesgloceAgente(fechaI, fechaF, agente, parseInt(tipo))
    }
    //choferes
    @Get('comisiones/choferes/:fechaI/:fechaF/:tipo')
    async getComisionChofer(@Param('fechaI') fechaI:string, @Param('fechaF') fechaF:string, @Param('tipo') tipo:string){
        return await this.recHService.getComisionesChofer(fechaI, fechaF, parseInt(tipo))
    }
    @Get('comisiones/choferes/:agente/:fechaI/:fechaF/:tipo')
    async getComisionChoferOne(@Param('fechaI') fechaI:string, @Param('fechaF') fechaF:string, @Param('agente') agente:string, @Param('tipo') tipo:string){
        return await this.recHService.getComisionesChofer(fechaI, fechaF, parseInt(tipo), agente)
    }
    @Post('/comisiones/choferes/:fechaI/:fechaF')
    async setComisionesChoferPagadas(@Param('fechaI') fechaI:string, @Param('fechaF') fechaF:string, @Body() body:ComisionChoferDTO[]){
        return await this.comisionService.saveViajesChofer(fechaI, fechaF, body)
    }
    @Get('/documento/:empresa/:serie/:folio')
    async getFactura(@Param('empresa') empresa:string, @Param('serie') serie:string, @Param('folio') folio:number){
        return await this.recHService.getDoc(empresa, serie, folio);
    }
    //#endregion

    //chofer
    @Post(`chofer/crear`)
    async insertChofer(@Body() body:RHChofer){
        if(body.estatus!=='ACTIVO'&&body.estatus!=='INACTIVO')return{mensaje:'El estatus es nvalido'}
        else return await this.choService.create(body);
    }
    
    @Get('/chofer/todos')
    async getChoferes(){
        return await this.choService.getList();
    }

    @Get('/chofer/todos/:estatus')
    async getChoferesFiltered(@Param('estatus') estatus:string){
        return await this.choService.getList(estatus);
    }

    @Get('/chofer/:codigo')
    async getChofer(@Param('codigo') codigo:string){
        return await this.choService.getOne(codigo);
    }

    @Patch('/chofer/:codigo')
    async updateChofer(@Param('codigo') codigo:string, @Body() body:RHChofer){
        return await this.choService.update({...body,codigo})
    }

    //catalogos vehiculos
    @Get('/vehiculo/catalogos/permisos')
    async getPermisos(){
        return await this.esqVehService.getPermisos();
    }

    @Get('/vehiculo/catalogos/configuraciones.vehiculares')
    async getConfiguraciones(){
        return await this.esqVehService.getConfiguraciones();
    }
    ///Vehiculo
    @Post(`vehiculo/crear`)
    async insertVehiculo(@Body() body:RHVehiculo){
        if(body.estatus!=='ACTIVO'&&body.estatus!=='INACTIVO')return{mensaje:'El estatus es nvalido'}
        else return await this.vehService.create(body);
    }
    
    @Get('/vehiculo/todos')
    async getVehculos(){
        return await this.vehService.getList();
    }

    @Get('/vehiculo/todos/:estatus')
    async getVehiculosFiltered(@Param('estatus') estatus:string){
        return await this.vehService.getList(estatus);
    }

    @Get('/vehiculo/:codigo')
    async getVehiculo(@Param('codigo') codigo:string){
        return await this.vehService.getOne(codigo);
    }

    @Patch('/vehiculo/:codigo')
    async updateVehiculo(@Param('codigo') codigo:string, @Body() body:Partial<RHVehiculo>){
        return await this.vehService.update({...body,codigo})
    }
}
