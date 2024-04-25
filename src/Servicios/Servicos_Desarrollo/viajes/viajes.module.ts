import { Module } from '@nestjs/common';
import { ViajesController } from './viajes.controller';
import { VehiculoService } from './vehiculo/vehiculo.service';
import { ChoferService } from './chofer/chofer.service';
import { ViajesService } from './viajes.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import entidadesViajes from 'src/entidades/entidadesDesarrollos/Viajes';
import entidadesList from 'src/entidades/entidadesCORP';
import entidadesCuentas from 'src/entidades/entidadesDesarrollos/Cuentas';
import entidadesBitacora from 'src/entidades/entidadesDesarrollos/Bitacora';
import { BitacoraService } from '../bitacora/bitacora.service';
import { FacturaCerradaService } from './factura_cerrada/factura_cerrada.service';
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
      ViajesService, 
      UsuariosService,
      BitacoraService,
      FacturaCerradaService
    ],
    controllers: [ViajesController]
  })
export class ViajesModule {}
