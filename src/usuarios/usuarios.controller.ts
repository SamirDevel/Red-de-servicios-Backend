import {Body, Controller, Post } from '@nestjs/common';
import CrearUsuarioDto from './dtos/create-user.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(private usuariosService:UsuariosService){}

    @Post('/registro')
    crearUsuario(@Body() body:CrearUsuarioDto){
        this.usuariosService.crear(body.usuario, body.psw);
    }
}
