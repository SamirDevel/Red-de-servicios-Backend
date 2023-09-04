import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { CreditoCobranzaService } from './credito.cobranza.service';
import { DocumentosService } from 'src/Servicos_CORP/documentos/documentos.service';
import { CreditoCobranzaController } from './credito.cobranza.controller';
import entidadesList from 'src/entidades';

@Module({
  imports:[
    TypeOrmModule.forFeature(entidadesList,'cdc'),
    TypeOrmModule.forFeature(entidadesList,'cmp')
  ],
  providers: [CreditoCobranzaService, DocumentosService],
  controllers: [CreditoCobranzaController]
})
export class CreditoCobranzaModule {}
