import { Injectable } from '@nestjs/common';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import Externo from 'src/entidades/entidadesCORP/externos.entity';
import { ChoferService } from 'src/Servicios/Servicos_Desarrollo/viajes/chofer/chofer.service';
import { VehiculoService } from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/vehiculo.service';
import Documento from 'src/entidades/entidadesCORP/documentos.entity';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';
import Serie from 'src/entidades/entidadesDesarrollos/Viajes/serie.entity';
import ViajeSalidaDTO from './DTOs/viaje.salida.dto';
import { getSesion } from 'src/interceptors/sessions interceptors/auth.guard';
import ConsultaViajeDTO from '../../../Servicios/Servicos_Desarrollo/viajes/vehiculo/DTOS/viaje.filtros.dto';
import { UsuariosService } from 'src/Servicios/Servicos_Desarrollo/usuarios/usuarios.service';
import { BitacoraService } from 'src/Servicios/Servicos_Desarrollo/bitacora/bitacora.service';
import Viaje from 'src/entidades/entidadesDesarrollos/Viajes/viajes.entity';

@Injectable()
export class FacturacionService {
    constructor(
        @InjectRepository(Externo,'cdc') private extRepoCDC:Repository<Externo>,
        @InjectRepository(Externo,'cmp') private extRepoCMP:Repository<Externo>,
        @InjectRepository(Documento,'cdc') private docRepoCDC:Repository<Documento>,
        @InjectRepository(Documento,'cmp') private docRepoCMP:Repository<Documento>,
        @InjectRepository(Serie,'viajes') private serRepo:Repository<Serie>,
        private vehService:VehiculoService,
        private choService:ChoferService,
        private viaService:ViajesService,
        private usuService:UsuariosService,
        private bitService:BitacoraService,
    ){}

    private getRepo(empresa:string){
        if(empresa==='cdc')return this.docRepoCDC
        if(empresa==='cmp')return this.docRepoCMP
        return null;
    }


    async getDoc(empresa:string, serie:string, folio:number){
        const repo = this.getRepo(empresa);
        if(repo!==null){
            try {
                const factura = await repo.createQueryBuilder('doc')
                .select('doc.serie')
                .addSelect('doc.folio')
                .addSelect('doc.total')
                .addSelect('doc.unidades')
                .addSelect('cli.nombre')
                .addSelect('cli.rfc')
                .addSelect('dom.tipoDireccion')
                .addSelect('dom.calle')
                .addSelect('dom.exterior')
                .addSelect('dom.colonia')
                .addSelect('dom.municipio')
                .addSelect('dom.codigoPostal')
                .addSelect('dom.estado')
                .leftJoin('doc.idCliente', 'cli')
                .leftJoin('cli.domicilios', 'dom')
                .where('doc.serie= :serie AND doc.folio = :folio', {serie, folio})
                .andWhere('dom.tipoCatalogo = 1')
                .getOne();
                if(factura===null)return {mensaje:'La busqueda no arrojo resultados'}
                return factura;
            } catch (error) {
                console.log(error)
                return {mensaje:'Algo salio mal al consultar la factura, reportar a soporte técnico'}
            }
        }else return {mensaje:'La seleccion de empresa no es válida'}
    }

    async insertCliente(params:Object) {
        
    }

    //Viajes
    private getVigencia(dias:number, origen:string){
        return `${origen} le quedan ${dias} dias restantes. Le sugerimos renovar lo antes posible\n`;
    }
    async crearViaje(nuevo:ViajeSalidaDTO){
        const usuario = getSesion(nuevo.idUsuario).usuario;
        const nombreusuario = await this.usuService.getUserByfilter({usuario});
        const today = new Date();
        today.setUTCHours(23, 59, 59, 999);
        const inicio = new Date(nuevo.fechaInicio);
        inicio.setUTCHours(23, 59, 59, 999);
        const datos = await Promise.all([this.choService.getOne(nuevo.codChofer), this.vehService.getOne(nuevo.codVehiculo)])
        const vigencia = new Date(datos[1].vigencia);
        const licencia = new Date(datos[0].vigencia);
        const chofer =datos[0];
        const auto = datos[1];
        const auxiliar = nuevo.codAuxiliar!==undefined?await this.choService.getOne(nuevo.codAuxiliar):undefined
        const array = nuevo.documentos;
        for(const index in array){
            const detalle = array[index]
            if(detalle.destino===undefined||array[index].destino==='')return {
                mensaje:`La factura ${detalle.serie}-${detalle.folio} no tiene seleccionado un destino`
            }
        }
        if(nuevo.reemplazo===true){
            const excepcionMotivo = 'es diferente del anterior. Verifique los datos e intente nuevamente.';
            if(nuevo.folioAnterior===undefined)return {mensaje:'Debe seleccionar el folio del viaje anterior'}
            const viajeAnterior = (await this.viaService.read({serie:nuevo.serieAnterior,folio:nuevo.folioAnterior}))[0];
            //console.log(nuevo)
            //console.log(viajeAnterior)
            if(viajeAnterior instanceof Viaje){
                if(viajeAnterior.estatus!=='CANCELADO')return {mensaje:'El viaje anterior debe estar cancelado para reemplazarlos'}
                if(datos[0]===null)return {mensaje:'Chofer no valido'}
                if(datos[1]===null)return {mensaje:'Vehciculo no valido'}
                if(nuevo.gasInicial>1)return{mensaje:'El tanque no puede ser superior a 1'}
                if(chofer.codigo!==viajeAnterior.chofer.codigo){
                    return {mensaje:`El chofer ${excepcionMotivo}`};
                }
                if(auto.codigo!==viajeAnterior.vehiculo.codigo){
                    return {mensaje:`El vehiculo ${excepcionMotivo}`};
                }
                if((viajeAnterior.auxiliar === null &&auxiliar !== undefined)
                ||viajeAnterior.auxiliar!==null && auxiliar===undefined
                ||viajeAnterior.auxiliar!==null&&auxiliar!==null&&viajeAnterior.auxiliar.codigo !== auxiliar.codigo){
                        return {mensaje:`El auxiliar ${excepcionMotivo}`};
                }
                if(nuevo.kmInicial!== viajeAnterior.kmInicial)return{mensaje:`El kilometraje ${excepcionMotivo}`}
                if(nuevo.dias!==viajeAnterior.dias)return{mensaje:`La estimacion de dias son diferentes al viaje original. Veerifique los datos e intente nuevamente`}
                if(nuevo.ruta !== viajeAnterior.ruta){}//return {mensaje:`La ruta ${excepcionMotivo}`}
                if(nuevo.gasInicial!==viajeAnterior.gasInicial)return {mensaje:`El gas inicial ${excepcionMotivo}`}
                const usuarioOriginal = await this.usuService.getUserByfilter({id:viajeAnterior.usuario})
                this.bitService.fireEvent({
                        registro:viajeAnterior.id,
                        columna:'Folio',
                        anterior:viajeAnterior.folio.toString(),
                        responsable:usuarioOriginal.nombre,
                        motivo:'Documento hecho de vuelta'
                    });
            }else if(viajeAnterior===undefined)return {mensaje:'El viaje original no es valido'}
            else return viajeAnterior;
        }else{
            if(datos[0]===null)return {mensaje:'Chofer no valido'}
            if(datos[1]===null)return {mensaje:'Vehciculo no valido'}
            if(inicio<today)return{mensaje:'No puede crear viajes con fechas anteriores a la actual'}
            if(nuevo.gasInicial>1)return{mensaje:'El tanque no puede ser superior a 1'}
            if(chofer!==undefined){
                if(await this.choService.onViaje(chofer.codigo)===true)
                    return {mensaje:'El chofer ya se encuentra en viajes pendientes'};
            }
            if(auto!==undefined){
                if(await this.vehService.onViaje(auto.codigo) ===true)
                    return {mensaje:'El vehiculo ya se encuentra en viajes pendientes'};
            }
            if(auxiliar!==undefined){
                if(await this.choService.onViaje(auxiliar.codigo) ===true)
                    return {mensaje:'El auxiliar ya se encuentra en viajes pendientes'};
            }
            if(nuevo.kmInicial<datos[1].km)return{mensaje:'El kilometraje es menor al correspondiente'}
            if(vigencia<today)return{mensaje:'El vehiculo no tiene un seguro vigente. Por favor seleccione otro o solicite el cambo del seguro'}
            if(licencia<today||licencia===null)return{mensaje:'El chofer tiene una lisencia vencida o no tiene liscencia. Por favor seleccione otro'}
            if(nuevo.dias<0)return{mensaje:'No puede haber una estimacion de duracion negativa'}
            if(nuevo.dias>3)return{mensaje:'La estimacion es superior a lo permitido'}
        }
        try {
            const serie = await this.serRepo.createQueryBuilder()
                .select()
                .where('serie =:serie', {serie:nuevo.serie})
                .getOne();
            //serie.
            const heads = await this.viaService.getHead((nuevo.empresa)as 'cdc'|'cmp')
            //console.log(heads)
            let result = await this.viaService.create({
                ...nuevo, 
                serie, 
                folio:heads.folio,
                chofer:datos[0], 
                auxiliar, 
                expedicion:today, 
                vehiculo:datos[1],
                usuario:nombreusuario.id,
                estatus:'PENDIENTE'
            }, nuevo.documentos)
            if(result['mensaje']===undefined){
                if(chofer.vigenciaRestante<=30)
                    result+=this.getVigencia(chofer.vigenciaRestante,'A la licencia del chofer');
                if(auto.vigenciaRestante<=30)
                    result+=result+=this.getVigencia(auto.vigenciaRestante,'Al segurro del auto');
                if(nuevo.folio!==heads.folio)
                    result += `El folio del viaje ha cambiado, el folio real es ${heads.folio}`
            }
            return result
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal en la creacion del viaje. Reportar a soporte tecnico'}
        }
    }
    async getViajes(query:ConsultaViajeDTO){
        try {
            const usuario = await (async ()=>{
                return query.usuario!==undefined
                ? (await this.usuService.getUserByfilter({usuario:query.usuario})).id
                :undefined
                
            })()
            return await this.viaService.read({...query, usuario})   
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal al consultar los viajes, reportar a soporte tecnico'}
        }
    }


}
