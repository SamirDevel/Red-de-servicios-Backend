import {Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import ListaCorp from "src/estructuras_y_algoritmos/lista.corp";
interface sesion{
    id?:number
    usuario:string
    area:string
}
let sesionId=1;
function restartSessions(){
    sesionId=1;
    sesiones.elementos = sesiones.elementos.map((item:sesion)=>{
        const obj:sesion={
            id:sesionId++,
            usuario:item['usuario'],
            area:item['area']
        }
        return obj;
    })
    setTimeout(restartSessions,1000*60*60*8)
}
const sesiones:ListaCorp<sesion> = new ListaCorp()
restartSessions();
export function deleteSession(id){
    for(const sesion in sesiones){
        if(id===sesiones[sesion]['id']){
            sesiones.remove((el1:sesion)=>el1.id===id)
            break;
        }
    }
}

export function setSesion(nueva:sesion){
    nueva = {
        id:sesionId++,
        ...nueva
    }
    sesiones.pushUnrepeat(nueva,(elemento:sesion)=>elemento.usuario===nueva.usuario);
    setTimeout(()=>{
        deleteSession(nueva['id']);
    },1000*60*60)
    return sesiones.retrive((elemento:sesion)=>elemento.usuario===nueva.usuario);
}

export function getSesion(id:number){
    return sesiones.retrive((elemento:sesion)=>elemento.id===id)
}

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(){}
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        const idses = parseInt(request.headers.idses);
        const response = context.switchToHttp().getResponse();
        if(idses===undefined){
            response.json({mensaje:'No hay usuario para realizar la accion'})
            return false
        }
        else {
            if(sesiones.findIndex((el1:sesion)=> el1.id===idses)!==-1)
                return true
            else{
                if(request.url==='/auth/ingresar')return true
                response.json({mensaje:'El usuaro no está registrado'})
                return false
            }
        };
    }
}
/** */