import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { RecursosHumanosService } from './recursos.humanos.service';
import { RecursosHumanosController } from './recursos.humanos.controller';
import entidadesList from 'src/entidades';

@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp')
  ],
  providers: [RecursosHumanosService],
  controllers: [RecursosHumanosController]
})
export class RecursosHumanosModule {}
