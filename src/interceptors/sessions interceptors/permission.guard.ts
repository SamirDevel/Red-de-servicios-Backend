import {Injectable, CanActivate, ExecutionContext, mixin } from "@nestjs/common";
import { getSesion } from "./auth.guard";

export function mixinPermission(codigoArea:string){
    class PermissionhGuard implements CanActivate{
        constructor(){}
        canActivate(context: ExecutionContext){
            const request = context.switchToHttp().getRequest();
            const idses = parseInt(request.headers.idses);
            const response = context.switchToHttp().getResponse();
            const area = getSesion(idses).area
            
            if(area===codigoArea||area==='GRC')
                    return true
                else{
                    response.json({mensaje:'El usuaro no tiene acceso a estas funciones'})
                    return false
                }
        }
    }

    const guard = mixin(PermissionhGuard);
    return guard;
}