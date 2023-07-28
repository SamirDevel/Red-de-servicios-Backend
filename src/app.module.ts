import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CdcModule } from './cdc/cdc.module';
import { CmpModule } from './cmp/cmp.module';

@Module({
  imports: [UsuariosModule, CdcModule, CmpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
