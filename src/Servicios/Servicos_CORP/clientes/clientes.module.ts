import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { ClientesService } from './clientes.service';
import { DomiciliosService } from '../domicilios/domicilios.service';
import { ClientesController } from './clientes.controller';
import entidadesList from 'src/entidades/entidadesCORP';

@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp')
  ],
  controllers: [ClientesController],
  providers: [ClientesService, DomiciliosService]
  })
export class ClientesModule {}
