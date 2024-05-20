import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogisticaService } from './logistica.service';
import { LogisticaController } from './logistica.controller';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';
import { UsuariosService } from 'src/Servicios/Servicos_Desarrollo/usuarios/usuarios.service';
import { BitacoraModule } from 'src/Servicios/Servicos_Desarrollo/bitacora/bitacora.module';
import entidadesList from 'src/entidades/entidadesCORP';
import entidadesViajes from 'src/entidades/entidadesDesarrollos/Viajes';
import entidadesCuentas from 'src/entidades/entidadesDesarrollos/Cuentas';

@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp'),
    TypeOrmModule.forFeature([...entidadesViajes],'viajes'),
    TypeOrmModule.forFeature([...entidadesCuentas],'cuentas'),
    BitacoraModule
  ],
  providers: [
    LogisticaService,
    ViajesService,
    UsuariosService
  ],
  controllers: [LogisticaController]
})
export class LogisticaModule {}
