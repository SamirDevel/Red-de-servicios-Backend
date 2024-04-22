import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { FacturacionService } from './facturacion.service';
import { FacturacionController } from './facturacion.controller';
import entidadesList from 'src/entidades/entidadesCORP';
import { VehiculoService } from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/vehiculo.service';
import { ChoferService } from 'src/Servicios/Servicos_Desarrollo/viajes/chofer/chofer.service';
import entidadesViajes from 'src/entidades/entidadesDesarrollos/Viajes';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';
import { UsuariosService } from 'src/Servicios/Servicos_Desarrollo/usuarios/usuarios.service';
import entidadesCuentas from 'src/entidades/entidadesDesarrollos/Cuentas';
import entidadesBitacora from 'src/entidades/entidadesDesarrollos/Bitacora';
import { BitacoraService } from 'src/Servicios/Servicos_Desarrollo/bitacora/bitacora.service';
@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp'),
    TypeOrmModule.forFeature([...entidadesViajes],'viajes'),
    TypeOrmModule.forFeature([...entidadesCuentas],'cuentas'),
    TypeOrmModule.forFeature([...entidadesBitacora],'bitacora')
  ],
  providers: [
    VehiculoService, 
    ChoferService, 
    FacturacionService, 
    ViajesService, 
    UsuariosService,
    BitacoraService
  ],
  controllers: [FacturacionController]
})
export class FacturacionModule {}
