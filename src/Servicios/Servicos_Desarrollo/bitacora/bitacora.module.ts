import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitacoraController } from './bitacora.controller';
import { BitacoraService } from './bitacora.service';
import entidadesBitacora from 'src/entidades/entidadesDesarrollos/Bitacora';
@Module({
  controllers: [BitacoraController],
  providers:[
    BitacoraService
  ],
  imports:[
    TypeOrmModule.forFeature([...entidadesBitacora],'bitacora')
  ],
  exports:[BitacoraService]
})
export class BitacoraModule {}
