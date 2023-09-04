import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ORMModule } from './ORMModule/orm.module';
import modulosDES from './entidadesDesarrollos/modulos';
import modulosCORP from './Servicos_CORP/modulos';
import modulosAreasList from './areas';

@Module({
  imports: [ORMModule, ...modulosCORP, ...modulosDES, ...modulosAreasList],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
