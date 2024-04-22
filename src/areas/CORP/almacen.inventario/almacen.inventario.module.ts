import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AlmacenInventarioService } from './almacen.inventario.service';
import { AlmacenInventarioController } from './almacen.inventario.controller';
import { PickingService } from '../../../Servicios/Servicos_Desarrollo/picking/picking.service';
import entidadesList from 'src/entidades/entidadesCORP';
import AlmacenList from 'src/entidades/entidadesDesarrollos/Almacen';

@Module({
  imports:[
    TypeOrmModule.forFeature([...entidadesList],'cdc'),
    TypeOrmModule.forFeature([...entidadesList],'cmp'),
    TypeOrmModule.forFeature([...AlmacenList],'alm'),
  ],
  providers: [AlmacenInventarioService, PickingService],
  controllers: [AlmacenInventarioController]
})
export class AlmacenInventarioModule {}
