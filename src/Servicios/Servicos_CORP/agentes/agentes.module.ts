import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AgentesController } from './agentes.controller';
import { AgentesService } from './agentes.service';
import entidadesList from 'src/entidades/entidadesCORP';

@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp')
  ],
  controllers: [AgentesController],
  providers: [AgentesService]
})
export class AgentesModule {}
