import {Body, Controller, Post, Session, Get, UseGuards, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import getUserDto from 'src/Servicios/Servicos_Desarrollo/usuarios/dtos/getUser.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}


    @UseGuards()
    @Post('/ingresar')
    async setUsuario(@Body() body:getUserDto){
        const user =  await this.authService.validar(body.usuario, body.psw);
        try{
            if(user ===null )throw new Error('Usuario inexistente')
            const sesion = await this.authService.abrirSesion(user);
            return {id:sesion['id'], area:sesion['area']};
        }catch(error){
            return {mensaje:error['Error']}
        }
    }

    @Get('/actual')
    async getUsuario(@Session() ses){
        return ses
    }

    @Post('/salir/:id')
    async quitUsuario(@Param() id:number){
        return await this.authService.cerrarSesion(id);
    }
}
