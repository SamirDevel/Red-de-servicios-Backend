import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ORMModule } from './ORMModule/orm.module';
import modulosDES from './entidadesDesarrollos/modulos';
import modulosCORP from './Servicos_CORP/modulos';

@Module({
  imports: [ORMModule, ...modulosCORP, ...modulosDES],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
