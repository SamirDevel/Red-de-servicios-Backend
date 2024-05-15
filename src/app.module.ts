import {Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ORMModule } from './ORMModule/orm.module';
import modulosDES from 'src/Servicios/Servicos_Desarrollo/modulos';
import modulosCORP from 'src/Servicios/Servicos_CORP/modulos';
import areasList from './areas';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ORMModule,
    ...modulosCORP,
    ...modulosDES,
    ...areasList,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
