import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { datosFactura } from '../ventas/ventas.service';
import AgentesDes from 'src/entidades/entidadesDesarrollos/Cuentas/agentes.des.entity';
import ListaCorp from 'src/estructuras_y_algoritmos/lista.corp';
import RegistroComision from 'src/entidades/entidadesDesarrollos/Comisiones/registro.comision.entity';
import DetalleComision from 'src/entidades/entidadesDesarrollos/Comisiones/detalle.comision.entity';
import AgenteRH from 'src/entidades/entidadesCORP/Extendidas/rh.agente.entity';
import { VentasService } from '../ventas/ventas.service';
import Chofer from 'src/entidades/entidadesDesarrollos/Viajes/chofer.entity';
import * as fns from '../../../estructuras_y_algoritmos/funciones'
import RegistroComisionChofer from 'src/entidades/entidadesDesarrollos/Comisiones/registro.comision.chofer.entity';
import DetalleComisionChofer from 'src/entidades/entidadesDesarrollos/Comisiones/detalle.comision.chofer.entity';
import { ViajesService } from '../viajes/viajes.service';
import Viaje from 'src/entidades/entidadesDesarrollos/Viajes/viajes.entity';

interface rangoEsquema{
    cantidad:number
    porcentaje:number

}
interface esquema{
    nombre:string
    rangos:rangoEsquema[]
}
interface bonoChofer{
    nombre:string
    valor:number
}
interface penalizacion{
    motivo:string
    valor:number
}
@Injectable()
export class ComisionService{
    private raiz:string
    constructor(
        @InjectRepository(AgentesDes, 'cuentas') private ageRepoDes:Repository<AgentesDes>,
        @InjectRepository(RegistroComision, 'comisiones') private regRepoDes:Repository<RegistroComision>,
        @InjectRepository(DetalleComision, 'comisiones') private detRepoDes:Repository<DetalleComision>,
        @InjectRepository(AgenteRH,'cuentas') private ageRepoDesRH:Repository<AgenteRH>,
        @InjectRepository(Chofer,'viajes') private choRepo:Repository<Chofer>,
        private ventasService:VentasService,
        @InjectRepository(RegistroComisionChofer, 'comisiones') private regChofRepoDes:Repository<RegistroComisionChofer>,
        @InjectRepository(DetalleComisionChofer, 'comisiones') private detChofRepoDes:Repository<DetalleComisionChofer>,
        private viajesService:ViajesService,
    ){
        this.raiz = 'Servicios/Servicos_Desarrollo/Comisiones'
    }

    async  getList(fechaI:string, fechaF:string, tipo:number, agente?:string){
        const respuesta = this.regRepoDes.createQueryBuilder('regs')
            .select('regs.id')
            .addSelect('regs.agente')
            .addSelect('regs.cobranza')
            .addSelect('regs.aTiempo')
            .addSelect('regs.fueraTiempo')
            .addSelect('regs.porcentaje')
            .addSelect('regs.descuentos')
            .addSelect('regs.anticipo')
            .addSelect('regs.inicio')
            .addSelect('regs.final')
            .addSelect('regs.tipo')
            .addSelect('regs.nombre')
            .addSelect('regs.esquema')
            .addSelect('regs.penalizacion')
            .where('regs.inicio = :fechaI AND regs.final = :fechaF',{fechaI,fechaF})
        if(agente!==undefined){
            respuesta.andWhere('regs.agente = :agente', {agente});
        }
        const resultado = await respuesta.getMany()
        return resultado.filter(registro=>registro.tipo===tipo)
    }

    private async getDetalles(codigo:string, fechaI:string, fechaF:string, tipo:number){
        const respuesta = await this.regRepoDes.createQueryBuilder('regs')
            .select('regs.id')
            .addSelect('regs.cobranza')
            .addSelect('regs.porcentaje')
            .addSelect('regs.anticipo')
            .addSelect('regs.descuentos')
            .addSelect('dets.serie')
            .addSelect('dets.folio')
            .addSelect('dets.expedicion')
            .addSelect('dets.vencimientoComision')
            .addSelect('dets.total')
            .addSelect('dets.aTiempo')
            .addSelect('dets.fueraTiempo')
            .addSelect('dets.nombre')
            .addSelect('dets.cobranza')
            .leftJoin('regs.detalles', 'dets')
            .where('regs.inicio = :fechaI AND regs.final = :fechaF',{fechaI,fechaF})
            .andWhere('regs.agente = :codigo', {codigo})
            .andWhere('dets.grupo = :tipo', {tipo})
            .getOne()
        return respuesta
    }
    private getCodigos(agente:AgentesDes, tipo:number){
        const codigos = new Array()
        if(agente.dependientes.length >0&&tipo===1){
            codigos.push(...agente.dependientes.map(dep=>{
                if(dep.codDependiente.codigo!==agente.codigo)return dep.codDependiente.codigo
                else return `''`
            }))
        }
        if(tipo===2){
            codigos.push(agente.codigo);
        }
        return codigos;
    }
    async build(codigo:string, fechaI:string, fechaF:string, tipo:number){
        try {
            const agente = await this.ageRepoDes.createQueryBuilder('agente')
                .select('agente.codigo')
                .addSelect('agente.nombre')
                .addSelect('agente.grupo')
                .addSelect('agente.esquema')
                .addSelect('rel.id')
                .addSelect('dep.codigo')
                .addSelect('dep.nombre')
                .addSelect('dep.grupo')
                .addSelect('dep.esquema')
                .leftJoin('agente.dependientes', 'rel')
                .leftJoin('rel.codDependiente', 'dep')
                .andWhere('agente.codigo = :codigo', {codigo})
                .setParameters({inicio:fechaI, final:fechaF})
                .getOne();
            const nuevo = new AuxiliarComision(agente.nombre, agente.codigo, agente.grupo);
            nuevo.setDeps(agente.dependientes.map(dep=>dep.codDependiente))
            const registro = await this.getDetalles(agente.codigo, fechaI, fechaF, tipo);
            //const registro=null
            if(registro!==null){
                nuevo.setDocsDets(registro.detalles)
            }else{
                const codigos = this.getCodigos(agente, tipo);
                const filtros = {
                    list:'true', 
                    agente:codigos, 
                    fechaI:new Date(fechaI), 
                    fechaF: new Date(fechaF)
                }
                const cdc = await this.ventasService.cobranzaTotal('cdc', filtros)
                const cmp = await this.ventasService.cobranzaTotal('cmp', filtros)
                nuevo.setDocumentos(cdc as any[], cmp as any[])
            }
            return nuevo
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal con la consulta desde las comisiones. Reportar a soporte tecnico'}
        }   
    }

    private setDetalles(lista:datosFactura[]){
        const result:DetalleComision[] = new Array();
        const end = lista.length;
        for(let i=0; i<end; i++){
            const obj = lista[i];
            const nuevo = this.detRepoDes.create()
            nuevo.serie = obj.serie,
            nuevo.folio = obj.folio,
            nuevo.aTiempo = obj.aTiempo,
            nuevo.fueraTiempo = obj.fueraTiempo
            nuevo.vencimientoComision = obj.vencimientoReal;
            nuevo.cobranza = obj.pendienteInicio + obj.adelantado
            result.push(nuevo);
        }
        return result
    }

    async saveRgistros(fechaI:string, fechaF:string, arreglo:Partial<RegistroComision>[]){
        const end = arreglo.length;
        const errores= new Array()
        for(let i=0; i<end; i++){
            const registro = arreglo[i]
            const agente = await this.ageRepoDes.createQueryBuilder('agente')
                .select('agente.codigo')
                .addSelect('rel.id')
                .addSelect('dep.codigo')
                .leftJoin('agente.dependientes', 'rel')
                .leftJoin('rel.codDependiente', 'dep')
                .andWhere('agente.codigo = :codigo', {codigo:registro.agente})
                .getOne();
            const nuevo = this.regRepoDes.create();
            nuevo.agente = registro.agente
            nuevo.cobranza = parseFloat(registro.cobranza.toFixed(2))
            nuevo.aTiempo = parseFloat(registro.aTiempo.toFixed(2))
            nuevo.fueraTiempo = parseFloat(registro.fueraTiempo.toFixed(2))
            nuevo.esquema = registro.esquema
            nuevo.porcentaje = registro.porcentaje
            nuevo.descuentos = parseFloat(registro.descuentos.toFixed(2))
            nuevo.anticipo = parseFloat(registro.anticipo.toFixed(2))
            nuevo.inicio = new Date(`${fechaI}T00:00:00`)
            nuevo.final = new Date(`${fechaF}T00:00:00`)
            nuevo.penalizacion = registro.penalizacion;
            try {
                //console.log(nuevo)
                await this.regRepoDes.save(nuevo)
                //const codigos = [`'${agente.codigo}'`, ...agente.dependientes.map(dep=>`'${dep.codDependiente.codigo}'`)]
                const codigos = this.getCodigos(agente, registro['grupo'])
                const filtros = {
                    list:'true', 
                    agente:codigos, 
                    fechaI:new Date(fechaI), 
                    fechaF: new Date(fechaF)
                }
                const cdc = await this.ventasService.cobranzaTotal('cdc', filtros)
                const cmp = await this.ventasService.cobranzaTotal('cmp', filtros)
                const detalles = this.setDetalles(cdc as any[])
                    .concat(this.setDetalles(cmp as any[]));
                detalles.forEach(async detalle=>{
                    try {
                        detalle.grupo = registro['grupo'];
                        detalle.idRegistro = nuevo;
                        //console.log(detalle);
                        await this.detRepoDes.save(detalle)
                    } catch (error) {
                        console.log(error)
                        errores.push({
                            agente:nuevo.agente,
                            inicio:nuevo.inicio,
                            final:nuevo.final,
                            serie:detalle.serie,
                            folio:detalle.folio,
                            error
                        })
                    }
                })
            } catch (error) {
                console.log(error)
                errores.push({
                    agente:nuevo.agente,
                    inicio:nuevo.inicio,
                    final:nuevo.final,
                    error
                })
            }
        }
        console.log(errores);
        if(errores.length>0)return{mensaje:'Ha currido un error al guardar los registros. Reportar a soporte tecnico'}
        return 'Registros guardados con exito'
    }
    private async getVentasAmbas({agente, fechaI, fechaF}){
        /*const respuesta = await Promise.all([
            this.ventasService.cobranzaTotal('cdc', {agente, fechaI, fechaF, list:'false'}),
            this.ventasService.cobranzaTotal('cmp', {agente, fechaI, fechaF, list:'false'}),
        ])*/
        const respuestaCDC = await this.ventasService.cobranzaTotal('cdc', {agente, fechaI, fechaF, list:'false'});
        const respuestaCMP = await this.ventasService.cobranzaTotal('cmp', {agente, fechaI, fechaF, list:'false'});
        const obj = {
            cobranzaPeriodo:fns.fixed(respuestaCDC['totalPeriodo'] + respuestaCMP['totalPeriodo']), 
            //cobradoPeriodo: fns.fixed(respuestaCDC['cobradoPeriodo'] + respuestaCMP['cobradoPeriodo']),
            aTiempoPeriodo: fns.fixed(respuestaCDC['aTiempoPeriodo'] + respuestaCMP['aTiempoPeriodo']),
            fueraTiempoPeriodo: fns.fixed(respuestaCDC['fueraTiempoPeriodo'] + respuestaCMP['fueraTiempoPeriodo']),
        }
        return obj
    }
    async getRelacionesComision(fechaI:string, fechaF:string, tipo:number, agente?:string){
        try {
            const dateI = new Date(fechaI)
            const dateF = new Date(fechaF)
            const query = this.ageRepoDesRH.createQueryBuilder('admins')
                .select('admins.codigo')
                .addSelect('admins.nombre')
                .addSelect('admins.grupo')
                .addSelect('admins.esquema')
                .andWhere(`admins.estatus = 'ACTIVO'`)
                .andWhere('admins.grupo = :tipo', {tipo})
                .setParameters({inicio:fechaI, final:fechaF});
            if(tipo===1)query.addSelect('rel.id')
                .addSelect('dep.codigo')
                .addSelect('dep.nombre')
                .addSelect('dep.grupo')
                .addSelect('dep.esquema')
                .leftJoin('admins.dependientes', 'rel')
                .leftJoin('rel.codDependiente', 'dep')
            if(agente!==undefined){
                query.andWhere('admins.codigo  = :agente', {agente});
            }
            const obj = {
                fechaI:dateI,
                fechaF:dateF,
            }
            const lista =  await query.getMany();
            const agentes = []
            for(const index in lista){
                const dato:any = lista[index];
                if(dato.grupo===1){
                    dato.dependientes = await Promise.all(dato.dependientes.map(async rel=>{
                        const dep = rel.codDependiente;
                        const nombre = dep.nombre;
                        const respuesta = await this.getVentasAmbas({...obj, agente:nombre});
                        //dep.ventas = respuesta['cobradoPeriodo'];
                        dep.cobranza = respuesta['cobranzaPeriodo']
                        dep.ventasATiempo = respuesta['aTiempoPeriodo'];
                        dep.ventasFueraTiempo = respuesta['fueraTiempoPeriodo'];   
                        return rel;
                    }))
                    agentes.push({...dato})
                }else if(dato.grupo===2){
                    const respuesta = await this.getVentasAmbas({...obj, agente:dato.nombre});
                    //dato.ventas = respuesta['cobradoPeriodo']
                    dato.cobranza = respuesta['cobranzaPeriodo']
                    dato.ventasATiempo = respuesta['aTiempoPeriodo']
                    dato.ventasFueraTiempo = respuesta['fueraTiempoPeriodo']
                    agentes.push({...dato})                
                }
            }
            /*const agentes =await Promise.all(lista.map(async dato=>{
                if(dato.grupo===1){
                    dato.dependientes = await Promise.all(dato.dependientes.map(async rel=>{
                        const dep = rel.codDependiente;
                        const nombre = dep.nombre;
                        const respuesta = await this.getVentasAmbas({...obj, agente:nombre});
                        dep.ventas = respuesta['cobradoPeriodo'];
                        dep.ventasATiempo = respuesta['aTiempoPeriodo'];
                        dep.ventasFueraTiempo = respuesta['fueraTiempoPeriodo'];   
                        return rel;
                    }))
                    return {...dato}
                }else if(dato.grupo===2){
                    const respuesta = await this.getVentasAmbas({...obj, agente:dato.nombre});
                    dato.ventas = respuesta['cobradoPeriodo']
                    dato.ventasATiempo = respuesta['aTiempoPeriodo']
                    dato.ventasFueraTiempo = respuesta['fueraTiempoPeriodo']
                    return {...dato}                
                }
            }));*/
            //await query.getMany()
            return agentes
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal al momento de cargar las relaciones desde las comisiones, informar a Soporte Técnico'} ;
        }
    }

    //#region comisiones de choferes
    private selecRuta(empresa:'cdc'|'cmp') {
        const base = (()=>{
            if(empresa==='cdc')return process.env.DB_NAME_CDC
            if(empresa==='cmp')return process.env.DB_NAME_CMP
        })() 
        return `SELECT CSEGCONT1 AS tipo
            FROM
            ${base}.dbo.admClasificacionesValores
            WHERE vjs.ruta = CCODIGOVALORCLASIFICACION`
    }
    private countRuta(query:SelectQueryBuilder<Chofer>, tipor:number){
        return query.andWhere(`(
            ${this.selecRuta('cdc')}
            UNION
            ${this.selecRuta('cmp')}
        ) = :tipor`, {tipor})
    } 
    private joinViajes(query:SelectQueryBuilder<Chofer>){
        return  function(alias:string, col:string){
            return query.select('COUNT(*)', alias)
            .leftJoin(`cho.${col}`, 'vjs')
        }
    }
    private countParadas(query:SelectQueryBuilder<Chofer>){
        return query.select(`COUNT(DISTINCT det.direccion)`, 'paradas')
            .leftJoin(`vjs.detalles`, 'det')
            .groupBy('vjs.id')
    }
    private factorizeQuery(query:SelectQueryBuilder<Chofer>) {
        const self = this;
        return function(alias:string, col:keyof Chofer){
            return function(tipor:number){
                return self.countRuta(self.joinViajes(query.clone())(alias, col),tipor)
            }
        }
    }
    private async getViajesRaw(query:SelectQueryBuilder<Chofer>, codigo:string, many?:boolean){
        const result = query.andWhere(`cho.codigo = :codigo`, {codigo})
            .andWhere('vjs.fechaFin >= :fechaI AND vjs.fechaFin <= :fechaF')
            .andWhere(`vjs.estatus = 'COMPLETADO'`)
        if(many===undefined)
            return await result.getRawOne()
        else{
            //console.log(query.getQueryAndParameters())
            const list = await result.getRawMany();
            let acum = 0;
            list.forEach(el=>{
                acum += el['paradas'];
            })
            return acum;
        }
    }
    async  getListChofer(fechaI:string, fechaF:string, tipo:number, chofer?:string){
        const respuesta = this.regChofRepoDes.createQueryBuilder('regs')
            .select()
            .leftJoinAndSelect('regs.detalles', 'dets')
            .where('regs.inicio = :fechaI AND regs.final = :fechaF',{fechaI,fechaF})
        if(chofer!==undefined){
            respuesta.andWhere('regs.chofer = :chofer', {chofer});
        }
        const resultado = await respuesta.getMany()
        const filtrados = resultado.filter(registro=>{
            return registro.tipo===tipo
        });
        return await Promise.all(filtrados.map(async chofer=>{
            chofer.detalles = await Promise.all(chofer.detalles.map(async det=>{
                const viaje = await this.viajesService.read({serie:det.serie, folio:det.folio});
                console.log(viaje)
                return viaje[0];
            }))
            return chofer
        }))
    }
    async getViajesChofer(fechaI:string, fechaF:string, tipo:number,codigo?:string){
        try {
            const query = this.choRepo.createQueryBuilder('cho')
                .select('cho.nombre')
                .addSelect('cho.codigo')
                .addSelect('cho.id')
                .addSelect('cho.tipo')
                .where('cho.estatus = :est',{est:'ACTIVO'})
                .andWhere('cho.tipo = :tipo', {tipo})
                .setParameters({fechaI, fechaF})
                
            if(codigo!==undefined)query.andWhere('cho.codigo = :codigo',{codigo})
            const lista = await query.getMany();
            const result  = (await Promise.all(lista.map(async cho=>{
                const viajes = await this.getViajesRaw(this.joinViajes(query.clone())('viajes', 'viajes'), cho.codigo)
                const aux = await this.getViajesRaw(this.joinViajes(query.clone())('aux', 'viajesAux'), cho.codigo)
                const localesQuery  = this.factorizeQuery(query)('locales', 'viajes')(3)
                const locales = await this.getViajesRaw(localesQuery.clone(), cho.codigo);
                const paradas = await this.getViajesRaw(this.countParadas(localesQuery.clone()), cho.codigo, true)
                const jaliscos = await this.getViajesRaw(this.factorizeQuery(query)('jaliscos', 'viajes')(2), cho.codigo)
                const foraneos = await this.getViajesRaw(this.factorizeQuery(query)('foraneos', 'viajes')(1), cho.codigo)
                return {...cho, ...viajes, ...aux, ...locales, ...foraneos, ...jaliscos, paradas}
            }))).filter(item=>item['viajes']>0||item['aux']>0)
            const filtros = {finI:fechaI, finF:fechaF, estatus:'COMPLETADO'};
            return Promise.all(result.map(async chofer=>{
                const listasViajes = await Promise.all([
                    this.viajesService.read({chofer:chofer.codigo, ...filtros}),
                    this.viajesService.read({auxiliar:chofer.codigo, ...filtros}),
                ]);
                const viajes = (listasViajes[0] as any[]).concat((listasViajes[1] as any[]).map((viaje:any)=>{
                    return {
                        ...viaje,
                        nombreTipoRuta:'Auxiliar',
                        tipoRuta:4
                    };
                }))
                return {
                    ...chofer,
                    detalles:viajes
                }
            }));
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal consultando los viajes. Reportar a soporte tecnico'}
        }
    }
    async saveViajesChofer(fechaI:string, fechaF:string, arreglo:Partial<RegistroComisionChofer>[]){
        try {
            //console.log(arreglo)
            for(const index in arreglo){
                const nuevo = this.regChofRepoDes.create({
                    inicio:fechaI,
                    final:fechaF,
                    ...arreglo[index]
                });
                const viajes = await this.viajesService.read({
                    estatus:'COMPLETADO',
                    finI:fechaI,
                    finF:fechaF,
                    chofer:arreglo[index].chofer

                })
                const viajesAux = (await this.viajesService.read({
                    estatus:'COMPLETADO',
                    finI:fechaI,
                    finF:fechaF,
                    auxiliar:arreglo[index].chofer
                    
                }) as []).map((viaje:Viaje)=>{
                    return {...viaje, tipoRuta:4}
                })
                const viajesTodos = (viajes as []).concat((viajesAux as [])).map((viaje:Viaje)=>{
                    return {
                        serie:viaje.serie.serie,
                        folio:viaje.folio,
                        tipoRuta:viaje.tipoRuta
                    }
                })
                const detalles = new Array();
                viajesTodos.forEach(element => {
                    detalles.push(this.detChofRepoDes.create(element))
                });
                nuevo.detalles = detalles.map(det=>det);
                //console.log(nuevo);
                this.regChofRepoDes.save(nuevo);
            }
            return 'Comisiones guardadas con exito'
        } catch (error) {
            console.log(error);
            return {mensaje: 'Algo salio mal al guardar las comisiones de choferes. Informar a soporte técnico'}
        }
    }
    //#endregion
    //#region esquemas 
    getEsquemas(nombre?:string){
        try {
            const lista = new ListaCorp(fns.getApendices(`${this.raiz}/esquemas`)as esquema[]);
            if(nombre!==undefined)
                return lista.retrive((item:esquema)=>item.nombre==nombre)
            else return lista.elementos;
        } catch (error) {
            console.log(error);
            return {mensaje: 'Algo salio mal obteniendo el esquema'}
        }

    }
    getEsquemasNombres(){
        return (this.getEsquemas() as esquema[]).map((el)=>{return {nombre:el.nombre}})
    }
    setEsquemas(nuevosEsquemas:esquema[]){
        return fns.setApendices(`${this.raiz}/esquemas`, nuevosEsquemas)
    }
    //#endregion
    //#region bonos por viajes
    getBonos(nombre?:string){
        try {
            const lista = new ListaCorp(fns.getApendices(`${this.raiz}/bonos.choferes`)as bonoChofer[]);
            if(nombre!==undefined)
                return lista.retrive((item:bonoChofer)=>item.nombre==nombre)
            else return lista.elementos;
        } catch (error) {
            console.log(error);
            return {mensaje: 'Algo salio mal obteniendo el bono'}
        }

    }
    getBonosNombres(){
        return (this.getBonos() as bonoChofer[]).map((el)=>{return {nombre:el.nombre}})
    }
    setBonos(nuevosBonos:bonoChofer[]){
        return fns.setApendices(`${this.raiz}/bonos.choferes`, nuevosBonos)
    }   
    //#endregion
    //#region penalizaciones
    async setPenalizaciones(nuevo:penalizacion[]){
        return fns.setApendices(`${this.raiz}/penalizaciones`, nuevo)
    }
    async getPenalizacion(id?:number){
        try {
            const result = fns.getApendices(`${this.raiz}/penalizaciones`)
            //console.log(query)
            return result;
        } catch (error) {
            console.log(error)
            return {mensaje:'Algo salio mal al leer la nueva penalizacion. Reportar a soporte técnico'}
        }
    }
    getMeta(){
        const meta = fns.getApendices(`${this.raiz}/meta`);
        //console.log(meta)
        return meta[0]
    }
    setMeta(meta:number){
        fns.setApendices(`${this.raiz}/meta`, [{meta}])
        return 'Meta de cobranza actualizada con exito'
    }
    //#endregion

}


class AuxiliarComision{
    public documentos:ListaCorp<datosFactura>|ListaCorp<DetalleComision>
    public deps:AgentesDes[]
    public saved:boolean
    constructor(
        public nombre:string,
        public codigo:string,
        public grupo:number,
    ){
        //this.documentos = new ListaCorp()
        this.deps = [];
    }

    setDocumentos(cdc:datosFactura[], cmp:datosFactura[]){
        this.documentos = new ListaCorp(cdc)
        this.documentos.fusion(cmp,(doc1:datosFactura, doc2:datosFactura)=>false)
    }

    setDocsDets(lista:DetalleComision[]){
        this.documentos = new ListaCorp(lista)
    }

    setDeps(lista:AgentesDes[]){
        this.deps = lista;
    }
}

