import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './documentos.service';
import entidadesList from 'src/entidades/entidadesCORP';

@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp')
  ],
  controllers: [DocumentosController],
  providers: [DocumentosService]
})
export class DocumentosModule {}