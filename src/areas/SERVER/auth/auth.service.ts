import { Injectable } from '@nestjs/common';
import { UsuariosService } from 'src/Servicios/Servicos_Desarrollo/usuarios/usuarios.service';
import { setSesion, deleteSession } from 'src/interceptors/sessions interceptors/auth.guard';
@Injectable()
export class AuthService {
    constructor(private userService:UsuariosService){
    }
    registrar(){

    }
    
    async validar(usuario:string,psw:string){
        const cuenta = await this.userService.getUser(usuario,psw);
        return cuenta;
    }
    
    async abrirSesion(usuario:Object):Promise<Object>{
        const area = await this.userService.getUserArea(usuario['id']);
        const nuevaSesion ={
            usuario:usuario['usuario'],
            area:area['idArea']['codigo']
        }
        return setSesion(nuevaSesion);
    }

    async cerrarSesion(idSesion:number):Promise<Object>{
        deleteSession(idSesion);
        return {mensaje:'Sesion Cerrada'};
    }

    async verSesiones(){
        //console.log(sessions);
        
    }

}
