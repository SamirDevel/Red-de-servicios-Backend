import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasController } from './ventas.controller';
import { VentasService } from './ventas.service';
import entidadesList from 'src/entidades/entidadesCORP';

@Module({
  imports:[
    TypeOrmModule.forFeature([...entidadesList],'cdc'),
    TypeOrmModule.forFeature([...entidadesList],'cmp'),
 ],
  controllers: [VentasController],
  providers: [VentasService]
})
export class VentasModule {}
