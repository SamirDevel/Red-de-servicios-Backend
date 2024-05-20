import { Injectable } from '@nestjs/common';
import ConsultaViajeDTO from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/DTOS/viaje.filtros.dto';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';
import { UsuariosService } from 'src/Servicios/Servicos_Desarrollo/usuarios/usuarios.service';

@Injectable()
export class LogisticaService {
    constructor(
        private serviceViajes:ViajesService,
        private usuService:UsuariosService,
    ){}

    async getViajes(query:ConsultaViajeDTO){
        try {
            const usuario = await (async ()=>{
                return query.usuario!==undefined
                ? (await this.usuService.getUserByfilter({usuario:query.usuario})).id
                :undefined
                
            })()
            return await this.serviceViajes.read({...query, usuario, estatus:'COMPLETADO'})
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal al consultar los viajes, reportar a soporte tecnico'}
        }
    }

}
