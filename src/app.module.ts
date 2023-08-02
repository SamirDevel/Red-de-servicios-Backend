import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CdcModule } from './cdc/cdc.module';
import { CmpModule } from './cmp/cmp.module';
import { DesarrollosModule } from './desarrollos/desarrollos.module';

@Module({
  imports: [DesarrollosModule, CdcModule, CmpModule, UsuariosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
