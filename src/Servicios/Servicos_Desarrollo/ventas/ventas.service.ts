import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fns from '../../../estructuras_y_algoritmos/funciones'
import Documento from 'src/entidades/entidadesCORP/documentos.entity';
interface datosObligatorios{
    fechaI:Date
    fechaF:Date
    list?:string
    agente?:string|string[]
    rutas?:string
}
export interface datosFactura{
    serie:string
    folio:number
    total:number
    expedicion:Date
    nombre:string
    pendienteInicio:number
    cobrado:number
    cancelado:number
    adelantado:number
    aTiempo:number
    fueraTiempo:number
    pendienteFinal:number
    vencimientoReal:Date
}

@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(Documento, 'cdc') private cdcRepoDoc:Repository<Documento>,
        @InjectRepository(Documento, 'cmp') private cmpRepoDoc:Repository<Documento>
    ){ }

    //filtros
    ///cobranza total    
    //metodos interfaz
    //Cobranza Total
    cobranzaTotalWhere(query:SelectQueryBuilder<Documento>){
        query.andWhere(`(
            (${this.calculoVencimientoString()} >= :fechaI AND ${this.calculoVencimientoString()} <= :fechaF)
            OR
            (${this.calculoVencimientoString()} > :fechaF AND pagos.expedicion >= :fechaI AND pagos.expedicion <= :fechaF AND pagos.idModelo != 5)
        )`);
    }
    carteraVencidaWhere(query:SelectQueryBuilder<Documento>){
        query.andWhere(`((${this.calculoVencimientoString()} < :fechaI))`);
    }
    async cobranzaTotal(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.cobranzaTotalWhere(query);
        query.having(`(
                (${this.pendienteQueryString()}) > 0
                OR (${this.adelantadoQueryString()}) > 0
            )`)
        let cobradoPeriodo = 0;
        let aTiempoPeriodo = 0;
        let fueraTiempoPeriodo = 0;
        let faltantePeriodo = 0;
        const result = await this.secuence(query,'la cobraza total',filtros.list,(element:Documento[],cont:Object)=>{
            cont['value'] += element['pendienteInicio'] + element['adelantado'];
            cobradoPeriodo += element['cobrado']
            aTiempoPeriodo += element['aTiempo']
            fueraTiempoPeriodo += element['fueraTiempo']
            faltantePeriodo += element['pendienteFinal']
        })
        aTiempoPeriodo = fns.fixed(aTiempoPeriodo)
        cobradoPeriodo  = fns.fixed(cobradoPeriodo)
        fueraTiempoPeriodo = fns.fixed(fueraTiempoPeriodo)
        if(result['mensaje']!==undefined||filtros.list==='true')
            return result
        else return {
            totalPeriodo:result, 
            aTiempoPeriodo, 
            fueraTiempoPeriodo, 
            cobradoPeriodo,
            faltantePeriodo
        };
    }

    async vencimientos(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.cobranzaTotalWhere(query);
        query.having(`((${this.pendienteQueryString()}) > 0)`)
        return {VENCIMIENTOS_PERIODO:await this.secuence(query,'vencimientos',filtros.list,(doc:Documento, cont:Object)=>{
            cont['value'] += doc['pendienteInicio'];
        })}
    }
    async adelantos(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.cobranzaTotalWhere(query);
        query.having(`((${this.adelantadoQueryString()}) > 0)`)
        return {ADELANTOS_PERIODO:await this.secuence(query,'adelantos',filtros.list,(doc:Documento, cont:Object)=>{
            cont['value'] += doc['adelantado'];
        })}
    }
    async cobrado(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.cobranzaTotalWhere(query);
        query.having(`((${this.cobradoQueryString()}) > 0)`)
         const result = await this.secuence(query,'los importes cobrados',filtros.list,(doc:Documento, cont:Object)=>{
            cont['value'] += doc['cobrado'];
        })
        if(result['mensaje']!==undefined||filtros.list==='true')
            return result;
        else return {cobradoPeriodo:result}
    }
    async aTiempo(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.cobranzaTotalWhere(query);
        query.having(`((${this.aTiempoQueryString()}) > 0)`)
        const result = await this.secuence(query,'los importes cobrados a tiempo',filtros.list,(doc:Documento, cont:Object)=>{
            cont['value'] += doc['aTiempo'];
        })
        if(result['mensaje']!==undefined||filtros.list==='true')
            return result;
        else return {aTiempoPeriodo:result}
    }
    async fueraTiempo(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.cobranzaTotalWhere(query);
        query.having(`((${this.fueraTiempoQueryString()}) > 0)`)
        const result = await this.secuence(query,'los importes cobrados fuera de tiempo',filtros.list,(doc:Documento, cont:Object)=>{
            cont['value'] += doc['fueraTiempo'];
        })
        if(result['mensaje']!==undefined||filtros.list==='true')
            return result;
        else return {fueraTiempoPeriodo:result}
    }
    async pendiente(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.cobranzaTotalWhere(query);
        query.having(`((${this.pendienteFinQueryString()}) > 0)`)
        const result = await this.secuence(query,'los importes pendientes',filtros.list,(doc:Documento, cont:Object)=>{
            cont['value'] += doc['pendienteFinal'];
        })
        if(result['mensaje']!==undefined||filtros.list==='true')
            return result;
        else return {pendientePeriodo:result}
    }
    //Cartera Vencida
    async CarteraVencida(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.carteraVencidaWhere(query);
        query.having(`((${this.deudaQueryString()}) > 0)`)
        //let deudaInicial = 0;
        let cobrado = 0;
        let cancelado = 0;
        let deudaFinal = 0;
        const result = await this.secuence(query,'el calculo de cartera vencida',filtros.list,(element:Documento,cont:Object)=>{
            cont['value'] += element['pendienteInicio'];
            cobrado += element['cobrado']
            cancelado += element['cancelado']
            deudaFinal += element['pendienteFinal']
        })
        cobrado = fns.fixed(cobrado)
        cancelado  = fns.fixed(cancelado)
        deudaFinal = fns.fixed(deudaFinal)
        if(result['mensaje']!==undefined||filtros.list==='true')
            return result
        else return {
            deudaInicial:result, 
            cobrado,
            cancelado,
            deudaFinal
        };
    }
    async recuperado(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.carteraVencidaWhere(query);
        query.having(`((${this.cobradoQueryString()}) > 0)`)
        const result = await this.secuence(query,'los importes recuperados de la cartera vencida',filtros.list,(doc:Documento, cont:Object)=>{
            cont['value'] += doc['cobrado'];
        })
        if(result['mensaje']!==undefined||filtros.list==='true')
            return result;
        else return {recuperado:result}
    }
    async cancelado(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.carteraVencidaWhere(query);
        query.having(`((${this.cobradoQueryString()}) > 0)`)
        const result = await this.secuence(query,'los importes cancelados de la cartera vencida',filtros.list,(doc:Documento, cont:Object)=>{
            cont['value'] += doc['cancelado'];
        })
        if(result['mensaje']!==undefined||filtros.list==='true')
            return result;
        else return {cancelado:result}
    }
    async deudaFinal(bdname:string, filtros:datosObligatorios){
        const query = await this.queryBase(bdname, filtros);
        this.carteraVencidaWhere(query);
        query.having(`((${this.pendienteFinQueryString()}) > 0)`)
        const result = await this.secuence(query,'la deuda pendiente del periodo',filtros.list,(doc:Documento, cont:Object)=>{
            cont['value'] += doc['pendienteFinal'];
        })
        if(result['mensaje']!==undefined||filtros.list==='true')
            return result;
        else return {deudaFinal:result}
    }

    ///Metodos privados
    private seleccionarBase(bdname:string){
        if(bdname==='cdc'){
            return this.cdcRepoDoc;
        }else if(bdname==='cmp'){
            return this.cmpRepoDoc;
        }else{
            return null;
        };
    }
    //Query Base
    pagoEnPerodoString(){
        return `(pagos.expedicion >= :fechaI AND pagos.expedicion <= :fechaF)`
    }
    vencimientoString(){
        return `(doc.expedicion + cli.diasCreditoCliente)`
    }
    calculoVencimientoString(){
        return `(${this.vencimientoString()}+ 3 + (${process.env.DB_NAME_COMISIONES}.dbo.diasInhabiles(${this.vencimientoString()}, ${this.vencimientoString()}+ 3)))`
    }
    pendienteQueryString(){
        return `CASE
            WHEN ${this.calculoVencimientoString()} <= :fechaF 
            THEN doc.total - SUM(COALESCE(
                CASE 
                    WHEN pagos.expedicion < :fechaI THEN asoc.CIMPORTEABONO
                    WHEN (${this.pagoEnPerodoString()} AND (pagos.idModelo = 5 OR pagos.idConcepto = 3016)) THEN asoc.CIMPORTEABONO
                    ELSE 0
                END, 0))
        ELSE 0
        END`
    }
    deudaQueryString(){
        return `ROUND(CASE
            WHEN ${this.calculoVencimientoString()} <= :fechaF 
            THEN doc.total - SUM(COALESCE(
                CASE 
                    WHEN pagos.expedicion < :fechaI THEN asoc.CIMPORTEABONO
                    ELSE 0
                END, 0))
        ELSE 0
        END, 2)`
    }
    cobradoQueryString(){
        return `SUM(CASE 
            WHEN ${this.pagoEnPerodoString()} AND pagos.idModelo != 5 THEN asoc.CIMPORTEABONO
            ELSE 0
        END)`
    }
    canceladoQueryString(){
        return `SUM(CASE 
            WHEN ${this.pagoEnPerodoString()} AND pagos.idModelo = 5 THEN asoc.CIMPORTEABONO
            ELSE 0
        END)`
    }
    adelantadoQueryString(){
        return `SUM(CASE 
            WHEN ${this.pagoEnPerodoString()} AND pagos.idModelo != 5 AND ${this.calculoVencimientoString()} > :fechaF THEN asoc.CIMPORTEABONO
            ELSE 0
        END)`
    }
    aTiempoQueryString(){
        return `SUM(CASE 
            WHEN ${this.pagoEnPerodoString()} AND pagos.idModelo != 5 AND pagos.expedicion <= ${this.calculoVencimientoString()} THEN asoc.CIMPORTEABONO
            ELSE 0
        END)`
    }
    fueraTiempoQueryString(){
        return `SUM(CASE 
            WHEN ${this.pagoEnPerodoString()} AND pagos.idModelo != 5 AND pagos.expedicion > ${this.calculoVencimientoString()} THEN asoc.CIMPORTEABONO
            ELSE 0
        END)`
    }
    pendienteFinQueryString(){
        return `CASE
        WHEN ${this.calculoVencimientoString()} <= :fechaF 
        THEN doc.total - SUM(COALESCE(
            CASE 
                WHEN pagos.expedicion <=:fechaF THEN asoc.CIMPORTEABONO
                ELSE 0
            END, 0))
        ELSE 0
        END`
    }
    async queryBase(bdname:string, filtros:datosObligatorios){
        const repo = this.seleccionarBase(bdname);
        filtros.fechaF.setUTCHours(23, 59, 59, 999);
        let concepto:number = null;
        let pagoConcepto:number = null;
        if(bdname==='cdc')concepto=3045
        if(bdname==='cmp')concepto=3038
        if(bdname==='cdc')pagoConcepto=3015
        if(bdname==='cmp')pagoConcepto=3016
        const query =repo.createQueryBuilder('doc')
            .select(`doc.serie`, 'serie')
            .addSelect(`doc.folio`, 'folio')
            .addSelect(`doc.total`, 'total')
            .addSelect(`doc.expedicion`, 'expedicion')
            .addSelect(`cli.nombre`, 'nombre')
            .addSelect(this.pendienteQueryString(), 'pendienteInicio')
            .addSelect(this.cobradoQueryString(), 'cobrado')
            .addSelect(this.canceladoQueryString(), 'cancelado')
            .addSelect(this.adelantadoQueryString(), 'adelantado')
            .addSelect(this.aTiempoQueryString(), 'aTiempo')
            .addSelect(this.fueraTiempoQueryString(), 'fueraTiempo')
            .addSelect(this.pendienteFinQueryString(), 'pendienteFinal')
            .addSelect(`${this.calculoVencimientoString()}`, 'vencimientoReal')
            //joins
            .leftJoin('doc.pagos', 'asoc')
            .leftJoin('asoc.idAbono', 'pagos')
            .leftJoin('doc.idCliente', 'cli')
            .leftJoin('cli.clasificacionCliente1', 'rut')
            .leftJoin('doc.idAgente', 'age')
            //.leftJoin('cli.domicilios', 'dom')
            //where
            .where('((doc.idModelo = 4 OR doc.idConcepto = :concepto) AND doc.cancelado = 0)', {concepto})
            .andWhere('((pagos.cancelado = 0  AND pagos.idConcepto != :pagoConcepto) OR pagos.cancelado IS NULL)')
            .setParameters({
                pagoConcepto,
                fechaI:filtros.fechaI,
                fechaF:filtros.fechaF
            })
        if(filtros.agente!==undefined)
            if(typeof filtros.agente === 'string'){
                query.andWhere('age.nombre = :nombreAgente',{nombreAgente:filtros.agente})
            }else{
                query.andWhere(`age.codigo IN (${filtros.agente.map(cad=>`'${cad}'`)})`)
            }
        if(filtros.rutas!==undefined){
            const rutasList = JSON.parse(decodeURIComponent(filtros.rutas))
            query.andWhere(`rut.valor IN (
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
        const ignoradas = fns.getApendices('areas/CORP/credito.cobranza/excluidas');
        if(Array.isArray(ignoradas)===true && (ignoradas as Array<any>).length>0){
            query.andWhere(`doc.id NOT IN (
                SELECT ignorados.CIDDOCUMENTO
                FROM admDocumentos ignorados
                WHERE ${(()=>{
                    const array = (ignoradas as Array<any>)
                    let cad =''
                    const end = array.length
                    for(let i=0; i<end;i++){
                        cad+=`(ignorados.CSERIEDOCUMENTO = '${array[i].serie}' AND ignorados.CFOLIO = ${array[i].folio})`
                        if(i<(end-1))cad += '\nOR '
                    }
                    return cad;
                })()})`)
        }
        query.groupBy('doc.serie')
            .addGroupBy('doc.folio')
            .addGroupBy('doc.expedicion')
            .addGroupBy('cli.diasCreditoCliente')
            .addGroupBy('doc.total')
            .addGroupBy('doc.expedicion')
            .addGroupBy('cli.razonSocial')
            .addGroupBy('cli.rfc')
            .addGroupBy('cli.txt3')
        //console.log(query.getQuery());
        /*const [str, params] = query.getQueryAndParameters();
        const result = await repo.query(`SELECT SUM(pendienteInicio)
        FROM (${str}) sq`,params)
        console.log(result)*/
        return query;
    }
    private async exec(lista:Documento[]){
        return function (toExec:Function){
            let cont = {value:0}
            lista.forEach(element=>{
                toExec(element, cont);
            })
            return function(list:string){
                if(list==='true')return lista;
                else return parseFloat(cont.value.toFixed(2))
            }
        }
    }
    private async secuence(query:SelectQueryBuilder<Documento>, origen:string, list:string, toExec:Function){
        const self = this
        async function test(){
            try {
                const lista = await query.getRawMany();
                const fn = await self.exec(lista)
                return function(toExec:Function){
                    const executed = fn(toExec)
                    return function(list:string){
                        return executed(list);
                    }
                }
            } catch (error) {   
                console.log(error);
                return {mensaje:`Algo salio mal con la consulta de ${origen} del periodo, reportar a soporte técnico'`}
            }
        }
        const inicio = await test();
        if(typeof inicio==='function'){
            return inicio(toExec)(list)
        }else{
            return inicio;
        }
    }
}