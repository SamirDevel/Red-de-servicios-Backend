import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { FacturacionService } from './facturacion.service';
import { FacturacionController } from './facturacion.controller';
import entidadesList from 'src/entidades';

@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp')
  ],
  providers: [FacturacionService],
  controllers: [FacturacionController]
})
export class FacturacionModule {}
