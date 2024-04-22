import { Injectable } from '@nestjs/common';
import * as fns from '../../../../../estructuras_y_algoritmos/funciones'
@Injectable()
export class EsquemasVehiculoService {
    constructor()
    {}

    private getListas(archivo:string){
        return fns.getApendices(`servicios/servicos_desarrollo/viajes/vehiculo/archivos/catalogo.${archivo}`)
    }
    getPermisos(){
        return this.getListas('permisos');
    }

    getConfiguraciones(){
        return this.getListas('configuracion.vehicular');
    }
}
