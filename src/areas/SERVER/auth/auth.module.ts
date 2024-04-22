import { Module, MiddlewareConsumer } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosService } from "src/Servicios/Servicos_Desarrollo/usuarios/usuarios.service";
import entidadesCuentas from 'src/entidades/entidadesDesarrollos/Cuentas';
//import { CurrentUserMiddleware } from 'src/interceptors/sessions interceptors/middleware.session';
@Module({
  imports:[
    TypeOrmModule.forFeature([...entidadesCuentas],'cuentas'),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsuariosService]
})
export class AuthModule {}
