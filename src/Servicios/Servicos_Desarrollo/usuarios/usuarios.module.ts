import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import entidadesCuentas from 'src/entidades/entidadesDesarrollos/Cuentas';

@Module({
  imports:[TypeOrmModule.forFeature([...entidadesCuentas],'cuentas')],
  controllers: [UsuariosController],
  providers: [UsuariosService]
})
export class UsuariosModule {}
