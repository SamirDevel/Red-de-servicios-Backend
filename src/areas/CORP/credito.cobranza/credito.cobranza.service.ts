import { Injectable } from '@nestjs/common';
import { empresa } from 'src/entidades/entidadesCORP/tiposDatos';
import cycDTO from './DTOS/cyc.dto';
import QueryFactory from '../../../estructuras_y_algoritmos/query.factory';
import { DocumentosService } from 'src/Servicios/Servicos_CORP/documentos/documentos.service';
import { ClientesService } from 'src/Servicios/Servicos_CORP/clientes/clientes.service';
import { DomiciliosService } from 'src/Servicios/Servicos_CORP/domicilios/domicilios.service';
import { UsuariosService } from 'src/Servicios/Servicos_Desarrollo/usuarios/usuarios.service';
import { ViajesService } from 'src/Servicios/Servicos_Desarrollo/viajes/viajes.service';
import ListaCorp from 'src/estructuras_y_algoritmos/lista.corp';
import * as fn from '../../../estructuras_y_algoritmos/funciones'
import * as path from 'path';
import * as fs from 'fs';
import ConsultaViajeDTO from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/DTOS/viaje.filtros.dto';
import ViajeLlegadaDTO from './DTOS/viaje.llegada.dto';
import CancelarViajeDTO from './DTOS/cancelar.viaje.dto';
import { BitacoraService } from 'src/servicios/servicos_desarrollo/bitacora/bitacora.service';
import CrearMotivoDTO from '../almacen.inventario/DTO/crear.motivo.dto';
import ActualizarViajeDTO from './DTOS/actualizar.viaje.dto';
import { ChoferService } from 'src/Servicios/Servicos_Desarrollo/viajes/chofer/chofer.service';
import { VehiculoService } from 'src/Servicios/Servicos_Desarrollo/viajes/vehiculo/vehiculo.service';
import Viaje from 'src/entidades/entidadesDesarrollos/Viajes/viajes.entity';


interface factura{
    serie:string
    folio:string
}

interface diaFestivo{
    dia:number
    mes:number
    año:number
}


@Injectable()
export class CreditoCobranzaService {
    constructor(
        private docService:DocumentosService,
        private extService:ClientesService,
        private domService:DomiciliosService,
        private viaService:ViajesService,
        private vehService:VehiculoService,
        private choService:ChoferService,
        private usuService:UsuariosService,
        private bitService:BitacoraService,
    ){ }
    //Genera un builder de sql con los datos basicos de las facturas
    //en base al servicio de documetos
    private async build(bdname:empresa, filtros:cycDTO){
        let builder =  await this.docService.getList(bdname, filtros);
        builder = await this.docService.clientData(builder)
        builder = await this.docService.domData(builder,false);
        builder = await this.docService.agentData(builder);
        return builder;
    }
    //#region saldos pendientes
    //#region modificaciones a los clientes DESDE FACTURAS
    comentarFactura(factura:factura, comentario:string){
        if(factura.serie!=''&&parseInt(factura.folio)>=0){
            try {
                const filePath = path.resolve(process.cwd(), 'src/areas/CORP/credito.cobranza/comentadas.json');
                const lista = new ListaCorp(this.getApendices('comentadas'));
                const nuevoComentario = {serie:factura.serie,folio:factura.folio, comentario}
                if(comentario!==''){
                    lista.replace(nuevoComentario, item=>{
                        return factura['serie']==item['serie']&&factura['folio']==item['folio'];
                    })
                }else{
                    lista.remove(item=>{
                        return factura['serie']==item['serie']&&factura['folio']==item['folio'];
                    })
                }
                const nueva = JSON.stringify(lista.elementos, null,2)
                fs.writeFileSync(filePath, nueva, 'utf8');
                return lista.elementos;
            } catch (error) {
                console.log(error)
                return {error:`Error al crear el registro: ${error}`};
            }
        }
    }

    quitComentario(factura:factura){
        const filePath = path.resolve(process.cwd(), 'src/areas/CORP/credito.cobranza/comentadas.json');
        if(factura.serie!=''&&parseInt(factura.folio)>=0){
            try {
                const lista:any[] =this.getApendices('comentadas').filter(fac=>
                    !(fac.serie ===factura.serie && fac.folio===factura.folio))
                const nueva = JSON.stringify(lista, null,2)
                fs.writeFileSync(filePath, nueva, 'utf8');
            } catch (error) {
                console.error('Error al crear el registro:', error);
            }
        }
    }
    
    getCometario(fatura:factura){
        const lista = new ListaCorp(this.getApendices('comentadas'));
        const facturaComentada = lista.retrive(elemento=>{
            return (fatura.serie===elemento.serie&&fatura.folio===elemento.folio);
        })
        return facturaComentada!==null?facturaComentada['comentario']:null;
    }
    //#endregion
    //factura unica para cyc
    async getOne(bdname:empresa, serie:string, folio:number){
        let builder = await this.docService.getOne(bdname, serie,folio)
        builder =  await this.docService.clientData(builder)
        builder = await this.docService.domData(builder, false);
        builder.addSelect('Externo.mail1')
        .addSelect('Domicilio.tel1')
        .addSelect('Domicilio.tel2')
        .addSelect('Externo.txt4')
        .addSelect('Externo.txt5')
        const factory = new QueryFactory(builder).pagos().clasificacion(bdname);
        return factory
    }

    private modificarYValidar(parametro1,parametro2,cambio:Function){
        if(parametro1!=parametro2)cambio(parametro1);
    }
    async modificarCliente(bdname:empresa, serie:string, folio:number, body){
        try {
            const documento = await ((await this.getOne(bdname, serie, folio)).getOne);
            const cliente = {id:documento['idCliente'].id};
            const domicilio = {id:documento['idCliente']['domicilios'][0]['id']};
            this.modificarYValidar(body['tel1'], domicilio['tel1'], (valor)=>domicilio['tel1']=valor);
            this.modificarYValidar(body['tel2'], domicilio['tel2'], (valor)=>domicilio['tel2']=valor);
            this.modificarYValidar(body['correo'], cliente['mail1'], (valor)=>cliente['mail1']=valor);
            this.modificarYValidar(body['contrarecivo'], cliente['txt4'], (valor)=>cliente['txt4']=valor);
            this.modificarYValidar(body['formaPago'], cliente['txt5'], (valor)=>cliente['txt5']=valor);
            this.modificarYValidar(body['clasificacion'], bdname==='cdc'?cliente['clasificacionCliente2']:cliente['clasificacionCliente4'], (valor)=>{
                if(bdname==='cdc')
                    cliente['clasificacionCliente2']=valor;
                else cliente['clasificacionCliente4']=valor;
            });
            this.modificarYValidar(body['activo']==true?1:0, cliente['estatus'], (valor)=>cliente['estatus']=valor);
            const msj1 = await this.extService.modificar(bdname,cliente);
            const msj2 = await this.domService.modificar(bdname,domicilio);
            this.comentarFactura({serie,folio:folio.toString()},body['observacion'])
            return {mensaje:`${msj1['mensaje']}\n${msj2['mensaje']}`}
        } catch (error) {
            return {mensaje:error}
        }
    }
    
    //Funcion para la lista de facturas con saldo pendiente
    async getList(bdname:empresa, filtros:cycDTO){
        const factory = new QueryFactory(await this.build(bdname, filtros));
        factory.rutas();
        factory.clasificacion(bdname);
        factory.filterBy('Documento')('pendiente')({
            alias:'p',
            value:0,
            operador:'>',
            opcional:false
        })
        factory.filterBy('Documento')('idModelo')({
            alias:'mod',
            value:4,
            operador:undefined,
            opcional:false
        })
        if(filtros.clasificacion!==undefined)
            factory.filterBy('Clasificacion')('codigo')({
                alias:'clasificacion',
                value:filtros.clasificacion,
                operador:undefined,
                opcional:false
            })
        
        if(filtros.ruta!==undefined)
        factory.filterBy('Ruta')('valor')({
            alias:'ruta',
            value:filtros.ruta,
            operador:undefined,
            opcional:false
        })

        const lista = new ListaCorp(await factory.getMany);
        if(filtros.restanteI!==undefined){
            lista.filter(item=>{
                return item['atraso']<= filtros.restanteI
            })
        }
        if(filtros.restanteF!==undefined){
            lista.filter(item=>{
                return item['atraso']>= filtros.restanteF
            })
        }
        
        const comentarios = this.getApendices('comentadas');
        comentarios.forEach(element => {
            lista.apendizar({observacion:element['comentario']},item=>{
                return item['serie']==element['serie']&&item['folio']==element['folio'];
            });
        });
        return lista.elementos
    }

    //#endregion

    //funcion para resetear los filtros y poder reutilizar codigo del servicio de documentos
    private vaciarFiltros(filtros:cycDTO){
        filtros.propietario = undefined;
        filtros.restanteI = undefined;
        filtros.restanteF = undefined;
        filtros.restanteIS = undefined;
        filtros.restanteFS = undefined;
        const fechaI = filtros.fechaI
        const fechaF = filtros.fechaF
        filtros.fechaI = undefined;
        filtros.fechaF = undefined;
        if(filtros.rutas!==undefined)filtros.rutasList = JSON.parse(decodeURIComponent(filtros.rutas))
        else filtros.rutasList = []
        return {filtros, fechaI, fechaF};
    }

    //filtros generales para los conceptos de cyc
    private filter<T>(factory:QueryFactory<T>, bdname:empresa, rutasList){
        factory.rutas();
        factory.pagos();
        factory.filterBy('Documento')('idModelo')({
            alias:'Modelo',
            value:4,
            opcional:false,
            operador:undefined
        })
        factory.filterBy('Documento')('idConcepto')({
            alias:'ConceptoCargo',
            value:bdname==='cdc'?3045:3038,
            opcional:true,
            operador:undefined
        })

        factory.pureQuery.andWhere(`(CASE
            WHEN Asoc.idAbono IS NOT NULL AND Pagos.idConcepto = :pagoConcepto THEN 0
            ELSE 1
        END = 1)`,{pagoConcepto:bdname==='cdc'?3015:3016});
        const ignoradas = this.getApendices('excluidas');
        if(ignoradas.length>0){
            factory.pureQuery.andWhere(`Documento.id NOT IN (
                SELECT docs.CIDDOCUMENTO
                FROM admDocumentos docs
                WHERE ${this.ignored(ignoradas)})`)
        }
        if(rutasList.length>0){
            factory.pureQuery.andWhere(`Ruta.valor IN (
                ${(()=>{
                    let str=''
                    const end = rutasList.length-1
                    rutasList.forEach((element, index) => {
                        str+=`'${element}'${index<end?',':''}`
                    });
                    return str;
                })()}
                )`)
        }

    }
    //JSON.parse(decodeURIComponent(rutas))
    private  dentroPeriodoVaido(pago, fechaI, fechaF){
        return pago.expedicion>=fechaI&&pago.expedicion<=fechaF&&pago.idModelo!==5
    }

    private  dentroPeriodoInvaido(pago, fechaI, fechaF){
        return pago.expedicion>=fechaI&&pago.expedicion<=fechaF&&pago.idModelo===5
    }

    //#region seccion relacionada a la gestion de las facturas excluidas
    private ignored(ignoradas:factura[]){
        let cad =''
        const end = ignoradas.length
        for(let i=0; i<end;i++){
            cad+=`(docs.CSERIEDOCUMENTO = '${ignoradas[i].serie}' AND docs.CFOLIO = ${ignoradas[i].folio})`
            if(i<(end-1))cad += '\nOR '
        }
        return cad;
    }
    
    setIgnorada(factura:factura){
        if(factura.serie!=''&&parseInt(factura.folio)>=0){
            try {
                const filePath = path.resolve(process.cwd(), 'src/areas/CORP/credito.cobranza/excluidas.json');
                const lista:any[] = this.getApendices('excluidas');
                lista.push({serie:factura.serie,folio:factura.folio});
                const nueva = JSON.stringify(lista, null,2)
                fs.writeFileSync(filePath, nueva, 'utf8');
                return lista.map(item=>{
                    return {...item,name:`${item.serie}-${item.folio}`}
                });
            } catch (error) {
                console.log(error)
                return {error:`Error al crear el registro: ${error}`};
            }
        }
    }

    quitIgnorada(factura:factura){
        const filePath = path.resolve(process.cwd(), 'src/areas/CORP/credito.cobranza/excluidas.json');
        if(factura.serie!=''&&parseInt(factura.folio)>=0){
            try {
                const lista:any[] =this.getApendices('excluidas').filter(fac=>{
                    return !(fac.serie ===factura.serie && fac.folio===factura.folio)
                })
                const nueva = JSON.stringify(lista, null,2)
                fs.writeFileSync(filePath, nueva, 'utf8');
            } catch (error) {
                console.error('Error al crear el registro:', error);
            }
        }
    }

    reincorporarIgnoradas(facturas:factura[]){
        facturas.forEach(fac=>{
            this.quitIgnorada(fac)
        })
    }
    //#endregion
    //#region seccion que corresponde a los conceptos de reporte de credito y cobranza
    //#region cartera vencida
    async carteraVencida(bdname:empresa, filtrosBase:cycDTO){
        const {filtros, fechaI, fechaF} = this.vaciarFiltros(filtrosBase);
        const builder = await this.build(bdname, filtros);
        const factory = new QueryFactory(builder);
        this.filter(factory,bdname, filtrosBase.rutasList);
        const lista = new ListaCorp(await factory.getMany);
        const deudaInicial = await this.deaudaInicial(lista.elementos,fechaI);
        const cobrado = await this.cobrado(deudaInicial.elementos,fechaI, fechaF)
        const cancelado = await this.cancelado(deudaInicial.elementos,fechaI, fechaF)
        const deudaFinal = await this.deaudaFinal(deudaInicial.elementos,fechaF);
        lista.addHeader = {
            ...deudaInicial.headers,
            ...cobrado.headers,
            ...cancelado.headers,
            ...deudaFinal.headers
        }
        const listFlag = fn.validatorBool(filtros.list, 'lista')
        if(listFlag===true){
            if(filtros.concepto==='inicial')
                return deudaInicial.elementos.map((item,index)=>({indicie:index+1,...item}))
            else if(filtros.concepto==='cobrado'){
                return cobrado.elementos.map((item,index)=>({indicie:index+1,...item}))
            }else if(filtros.concepto==='cancelado'){
                return cancelado.elementos.map((item,index)=>({indicie:index+1,...item}))
            }else if(filtros.concepto==='final'){
                return deudaFinal.elementos.map((item,index)=>({indicie:index+1,...item}))
            }
        }else return lista.headers
    }

    async deaudaInicial(elementos:any[], fechaI:Date){
        const lista = new ListaCorp(elementos);
        lista.filter(item=>{
            if(item.vencimientoReal<fechaI){
                if( item.pagos.length> 0){
                    let pendienteIncio = item.total;
                    item.pagos.forEach(asoc=>{
                        pendienteIncio-= asoc.idAbono.expedicion<fechaI
                            ?asoc.importeAbono
                            :0
                    })
                    return pendienteIncio.toFixed(2)>0
                }else return item.pendiente.toFixed(2)>0
            }else return false
        })
        lista.quickSort((item1,item2)=>`${item1.serie}-${item1.folio}`<`${item2.serie}-${item2.folio}`)
        const deudaInicial = parseFloat(lista.acumulate(item=>{
            if( item.pagos.length> 0){
                let pendienteIncio = item.total;
                item.pagos.forEach(asoc=>{
                    pendienteIncio-= asoc.idAbono.expedicion<fechaI
                        ?asoc.importeAbono
                        :0
                })
                return pendienteIncio
            }else return item.pendiente
        }).toFixed(2))
        lista.addHeader = {deudaInicial}
        return lista
    }

    async cobrado(elementos:any[], fechaI:Date, fechaF:Date){
        const lista = new ListaCorp(elementos);
        lista.filter(item=>{
            if(item.pagos.length>0){
                const pagos = new Array()
                for(const asoc in item.pagos){
                    const pago = item.pagos[asoc].idAbono
                    if(this.dentroPeriodoVaido(pago,fechaI,fechaF))
                        pagos.push(item.pagos[asoc]);
                }
                return pagos.length>0
            }else return false
        })
        const cobrado = parseFloat(lista.acumulate(item=>{
            let acum = 0;
            for(const asoc in item.pagos){
                const pago = item.pagos[asoc].idAbono
                if(this.dentroPeriodoVaido(pago,fechaI,fechaF))
                    acum+=item.pagos[asoc].importeAbono
            }
            return acum
        }).toFixed(2))
        lista.addHeader = {cobrado}
        return lista
    }

    async cancelado(elementos:any[], fechaI:Date, fechaF:Date){
        const lista = new ListaCorp(elementos);
        lista.filter(item=>{
            if(item.pagos.length>0){
                const pagos = new Array()
                for(const asoc in item.pagos){
                    const pago = item.pagos[asoc].idAbono
                    if(this.dentroPeriodoInvaido(pago,fechaI,fechaF))
                        pagos.push(item.pagos[asoc]);
                }
                return pagos.length>0
            }else return false
        })
        const cancelado = parseFloat(lista.acumulate(item=>{
            let acum = 0;
            for(const asoc in item.pagos){
                const pago = item.pagos[asoc].idAbono
                if(this.dentroPeriodoInvaido(pago,fechaI,fechaF))
                    acum+=item.pagos[asoc].importeAbono
            }
            return acum
        }).toFixed(2))
        lista.addHeader = {cancelado}
        return lista
    }

    async deaudaFinal(elementos:any[], fechaF:Date){
        const lista = new ListaCorp(elementos);
        lista.filter(item=>{
            if( item.pagos.length> 0){
                let pendienteIncio = item.total;
                item.pagos.forEach(asoc=>{
                    pendienteIncio-= asoc.idAbono.expedicion<=fechaF
                        ?asoc.importeAbono
                        :0
                })
                return pendienteIncio.toFixed(2)>0
            }else return item.pendiente.toFixed(2)>0
        })
        const deudaFinal = parseFloat(lista.acumulate(item=>{
            if( item.pagos.length> 0){
                let pendienteIncio = item.total;
                item.pagos.forEach(asoc=>{
                    pendienteIncio-= asoc.idAbono.expedicion<=fechaF
                        ?asoc.importeAbono
                        :0
                })
                return pendienteIncio
            }else return item.pendiente
        }).toFixed(2))
        lista.addHeader = {deudaFinal}
        return lista
    }
    //#endregion
    async promedios(bdname:empresa, filtrosBase:cycDTO){
        const {filtros, fechaI, fechaF} = this.vaciarFiltros(filtrosBase);
        const builder = await this.build(bdname, filtros);
        const factory = new QueryFactory(builder);
        this.filter(factory,bdname, filtrosBase.rutasList);
        const lista = new ListaCorp(await factory.getMany);
        const deuda = await this.promedioDeuda(lista.elementos,fechaI,fechaF)
        const vencidas = await this.promedioVencida(deuda.elementos,fechaI,fechaF)
        lista.addHeader = {
            ...deuda.headers,
            ...vencidas.headers,
        }
        const listFlag = fn.validatorBool(filtros.list, 'lista')
        if(listFlag===true){
            if(filtros.concepto==='deuda')
                return deuda.elementos.map((item,index)=>({indicie:index+1,...item}))
            else if(filtros.concepto==='vencidas'){
                return vencidas.elementos.map((item,index)=>({indicie:index+1,...item}))
            }
        }else return lista.headers
    }

    async promedioDeuda(elementos:any[], fechaI:Date, fechaF:Date){
        const lista = new ListaCorp(elementos);
        lista.filter(item=>{
            if( item.pagos.length> 0){
                let pendienteIncio = item.total;
                item.pagos.forEach(asoc=>{
                    pendienteIncio-= asoc.idAbono.expedicion<=fechaF
                        ?asoc.importeAbono
                        :0
                })
                return pendienteIncio.toFixed(2)>0&&item.expedicion<=fechaF
            }else return item.pendiente.toFixed(2)>0&&item.expedicion<=fechaF;
        })
        let cont = 0;
        const Deuda = parseFloat(lista.acumulate(item=>{
            let pendienteFin = item.total;
            item.pagos.forEach(asoc=>{
                pendienteFin-= asoc.idAbono.expedicion<=fechaF
                    ?asoc.importeAbono
                    :0
            })
            if(item.pendiente>0||pendienteFin>0){
                cont++;
                const dif = fn.daysDif(item.expedicion,fechaF)
                return dif<0?dif*-1:dif;
            }else return 0;
        }).toFixed(2))
        const promedioDeuda = cont>0?parseFloat((Deuda/cont).toFixed(2)):0
        lista.addHeader = {promedioDeuda}
        return lista
    }

    async promedioVencida(elementos:any[], fechaI:Date, fechaF:Date){
        const lista = new ListaCorp(elementos);
        lista.filter(item=>{
            const retraso = fn.daysDif(item.vencimientoReal,fechaF)
            return retraso<0
            
        })
        let cont = 0;
        const vencida = parseFloat(lista.acumulate(item=>{
            let pendienteFin = item.total;
            item.pagos.forEach(asoc=>{
                pendienteFin-= asoc.idAbono.expedicion<=fechaF
                    ?asoc.importeAbono
                    :0
            })
            const retraso = fn.daysDif(item.vencimientoReal,fechaF)
            if((item.pendiente>0||pendienteFin>0)&&retraso<0){
                cont++;
                return retraso*-1;
            }else return 0;
        }).toFixed(2))
        const promedioVencida = cont>0?parseFloat((vencida/cont).toFixed(2)):0
        lista.addHeader = {promedioVencida}
        return lista
    }
    //#endregion
    //obtener lista de facturas de un archivo
    getApendices(archivo:string, name?:boolean){
        try {
            const filePath = path.resolve(process.cwd(), `src/areas/CORP/credito.cobranza/${archivo}.json`);
            const data = fs.readFileSync(filePath, 'utf8');
            const elementos = JSON.parse(data);
            if(name===undefined)return elementos.map(item=>{
                return {...item,name:`${item.serie}-${item.folio}`}
            })
            else return elementos
        }catch(error){
            return {error};       
        }
    }


    getDiasFestivos(){
        const lista = new ListaCorp<diaFestivo>(this.getApendices('dias.festivos', true));
        return lista.elementos;
    }

    private setDiasFestivos(lista:diaFestivo[]){
        try {
            const filePath = path.resolve(process.cwd(), 'src/areas/CORP/credito.cobranza/excluidas.json');
            const nueva = JSON.stringify(lista, null,2)
            fs.writeFileSync(filePath, nueva, 'utf8');
            return 'Esquemas guardados corectamente'
        } catch (error) {
            console.log(error);
            return {mensaje:'Error al actualizar a lista de días festivos:'};
        }
    }

    addDiaFestivo(fecha:diaFestivo){
        const lista:diaFestivo[] = this.getDiasFestivos();
        lista.push(fecha);
        this.setDiasFestivos(lista)
    }
    quitDiaFestivo(nueva:diaFestivo){
        const lista:diaFestivo[] = this.getDiasFestivos();
        lista.filter(fecha=>{
            return fecha.dia!==nueva.dia&&fecha.mes!==nueva.mes&&fecha.año!==nueva.año
        });
        this.setDiasFestivos(lista)
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
    async closeViajes(serie:string, folio:number, datos:ViajeLlegadaDTO){
        try {
            return await this.viaService.update(serie,folio, {...datos, estatus:'COMPLETADO'}, datos.documentos);
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal al consultar los viajes, reportar a soporte tecnico'}
        }
    }

    async getMotivos(evento:string){
        try {
            return await this.bitService.getMotivos('Viaje', evento)
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal consultano los eventos, Reportar a soporte tecnico. '}
        }
    }
    async setMotivo(evento:string, datos:CrearMotivoDTO){
        try {
            return await this.bitService.setMotivo('Viaje', evento, datos)
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal consultano los eventos, Reportar a soporte tecnico. '}
        }
    }
    async cancelViajes(serie:string, folio:number, datos:CancelarViajeDTO){
        try {
            return await this.viaService.update(serie,folio, {estatus:'CANCELADO'}, undefined, {...datos});
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal al cancelar los viajes, reportar a soporte tecnico'}
        }
    }
    async updateViajes(serie:string, folio:number, datos:ActualizarViajeDTO){
        try {
            const chofer = datos.chofer!==undefined?await this.choService.getOne(datos.chofer):undefined
            const auxiliar = datos.auxiliar!==undefined?await this.choService.getOne(datos.auxiliar):undefined
            const vehiculo = datos.vehiculo!==undefined?await this.vehService.getOne(datos.vehiculo):undefined
            const viaje = (await this.viaService.read({serie, folio}))[0];
            if(new Date(datos.fechaFin)<viaje.fechaInicio)
                return {mensaje:'La fecha final no puede ser menor a la de inicio'}
            if(datos.kmFinal<=viaje.kmInicial)
                return {mensaje:'La el kilometraje final no puede ser menor a la de inicio'}
            if(chofer!==undefined){
                if(this.choService.onViaje(datos.chofer))
                    return {mensaje:'El chofer ya se encuentra en viajes pendientes'};
            }
            if(vehiculo!==undefined){
                if(this.vehService.onViaje(datos.vehiculo))
                    return {mensaje:'El vehiculo ya se encuentra en viajes pendientes'};
            }
            if(auxiliar!==undefined){
                if(this.choService.onViaje(datos.auxiliar))
                    return {mensaje:'El auxiliar ya se encuentra en viajes pendientes'};
            }
            const obj = {
                ...datos,
                chofer,
                auxiliar,
                vehiculo,
            }
            return await this.viaService.update(serie,folio, {...obj}, undefined, {...datos});
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal al actualizar los viajes, reportar a soporte tecnico'}
        }
    }
}
