import {Body, Controller, Post, Get } from '@nestjs/common';
import CrearUsuarioDto from './dtos/create-user.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(private usuariosService:UsuariosService){}

    @Get('/todos')
    crearUsuario(){
        return this.usuariosService.list();
    }

    /*
        @Body() body:CrearUsuarioDto
    */
}
