import {Query, Controller, Post, Get } from '@nestjs/common';
import CrearUsuarioDto from './dtos/create-user.dto';
import getUserDto from './dtos/getUser.dto';
import { UsuariosService } from './usuarios.service';
interface areaQuery{
    area:string
}
@Controller('usuarios')
export class UsuariosController {
    constructor(private usuariosService:UsuariosService){}

    @Get('/todos')
    listarUsuarios(@Query() query:areaQuery){
        return this.usuariosService.list(query.area);
    }
    
    /*@Post('/usuario')
    async getUsuario(@Body() body:getUserDto){
        return await this.usuariosService.getUser(body.usuario, body.psw);
    }*/

    /*
        @Body() body:CrearUsuarioDto
    */
}
