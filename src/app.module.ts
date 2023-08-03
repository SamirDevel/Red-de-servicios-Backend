import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ORMModule } from './ORMModule/orm.module';
import modulosCMP from './entidades/modulos';
import modulosDES from './entidadesDesarrollos/modulos';

@Module({
  imports: [ORMModule, ...modulosCMP, ...modulosDES],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
