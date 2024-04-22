import { Controller, Get, Post, Body, Param, Query, UseInterceptors, UseGuards} from '@nestjs/common';
import { mixinPermission } from 'src/interceptors/sessions interceptors/permission.guard';
import { AlmacenInventarioService } from './almacen.inventario.service';
import { PickingService } from '../../../Servicios/Servicos_Desarrollo/picking/picking.service';
import ConcnetradoDTO from './DTO/concnetrado.dto';
import ValidacionPickingDTO from './DTO/validacion.dto';

@UseGuards(mixinPermission('ALM'))
@Controller('almacen.inventario')
export class AlmacenInventarioController {
    constructor (
        private almService:AlmacenInventarioService,
        private picService:PickingService
    )
    { }

    @Get('/calcular/:empresa/:serie/:folioI/:folioF')
    calcularPicking(@Param('empresa') empresa:string, @Param('serie') serie:string, @Param('folioI') folioI:string, @Param('folioF') folioF:string){
        return this.picService.calcular(empresa, serie, parseInt(folioI), parseInt(folioF))
    }

    @Get('/validar/:empresa/:fechaI/:fechaF/:documento')
    validarPicking(@Param('empresa') empresa:string, @Param('fechaI') fechaI:string, @Param('fechaF') fechaF:string, @Param('documento') documento:string, @Query() filtros:ValidacionPickingDTO){
        return this.almService.consultarDocs(empresa, fechaI, fechaF, documento, filtros)
    }

    @Post('/calcular/:empresa')
    concentrarPicking(@Param('empresa') empresa:string, @Body() body:ConcnetradoDTO[]){
        return this.picService.concentrar(body, empresa)
    }

    @Post('/guardar/:empresa/:ruta')
    crearPicking(@Param('empresa') empresa:string, @Param('ruta') ruta:string, @Body() body:ConcnetradoDTO[]){
        return this.picService.create(body, empresa, ruta)
    }

    @Get('/consultar/:ruta/:empresa/:fechaI/:fechaF')
    consultarPicking(@Param('ruta') ruta:string, @Param('empresa') empresa:string, @Param('fechaI') fechaI:string, @Param('fechaF') fechaF:string){
        if(ruta==='NA')ruta = undefined
        if(fechaI==='NA')fechaI = undefined
        if(fechaF==='NA')fechaF = undefined
        if(empresa==='NA')empresa = undefined
        return this.picService.read(ruta, fechaI, fechaF, empresa)
    }
}
