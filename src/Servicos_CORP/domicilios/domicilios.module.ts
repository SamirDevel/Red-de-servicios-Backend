import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { DomiciliosController } from './domicilios.controller';
import { DomiciliosService } from './domicilios.service';
import entidadesList from 'src/entidades';

@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp')
  ],
  controllers: [DomiciliosController],
  providers: [DomiciliosService]
})
export class DomiciliosModule {}
