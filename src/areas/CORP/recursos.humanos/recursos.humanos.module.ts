import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { RecursosHumanosService } from './recursos.humanos.service';
import { RecursosHumanosController } from './recursos.humanos.controller';
import entidadesList from 'src/entidades/entidadesCORP';
import entidadesCuentas from 'src/entidades/entidadesDesarrollos/Cuentas';
import ComisionesEntities from 'src/entidades/entidadesDesarrollos/Comisiones';
import { ComisionService } from 'src/Servicios/Servicos_Desarrollo/Comisiones/Comision.service';
import { AgenteDesService } from 'src/servicios/servicos_desarrollo/agente-des/agente-des.service';
import { ChoferService } from 'src/Servicios/Servicos_Desarrollo/viajes/chofer/chofer.service';
import { VehiculoService } from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/vehiculo.service';
import entidadesViajes from 'src/entidades/entidadesDesarrollos/Viajes';
import AgenteChofer from 'src/entidades/entidadesCORP/Extendidas/Agente.chofer.entity';
import DomicilioChofer from 'src/entidades/entidadesCORP/Extendidas/Domicilio.chofer.entity';
import { EsquemasVehiculoService } from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/esquemas.vehiculo/esquemas.vehiculo.service';
import { VentasService } from 'src/Servicios/Servicos_Desarrollo/ventas/ventas.service';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';
import { BitacoraService } from 'src/Servicios/Servicos_Desarrollo/bitacora/bitacora.service';
import entidadesBitacora from 'src/entidades/entidadesDesarrollos/Bitacora';

@Module({
  imports:[
    TypeOrmModule.forFeature([...entidadesList, AgenteChofer, DomicilioChofer],'cdc'),
    TypeOrmModule.forFeature([...entidadesList, AgenteChofer, DomicilioChofer],'cmp'),
    TypeOrmModule.forFeature([...entidadesCuentas],'cuentas'),
    TypeOrmModule.forFeature([...ComisionesEntities],'comisiones'),
    TypeOrmModule.forFeature([...entidadesViajes],'viajes'),
    TypeOrmModule.forFeature([...entidadesBitacora],'bitacora')
  ],
  providers: [RecursosHumanosService,
    ComisionService,
    AgenteDesService,
    ChoferService,
    VehiculoService,
    EsquemasVehiculoService,
    VentasService,
    BitacoraService,
    ViajesService
  ],
  controllers: [RecursosHumanosController]
})
export class RecursosHumanosModule {}
