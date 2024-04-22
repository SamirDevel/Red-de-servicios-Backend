import { Injectable } from '@nestjs/common';
import { Repository} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import ProductoPicking from '../../../entidades/entidadesCORP/Extendidas/Producto.picking.entity';
import Picking from 'src/entidades/entidadesDesarrollos/Almacen/picking.entity';
import PickingRango from 'src/entidades/entidadesDesarrollos/Almacen/rango.picking.entity';
import PickingDetalle from 'src/entidades/entidadesDesarrollos/Almacen/detalle.picking.entity';
import Documento from 'src/entidades/entidadesCORP/documentos.entity';

interface seccion{
    serie:string
    folioI:number
    folioF:number
}

@Injectable()
export class PickingService {
    constructor(
        @InjectRepository(ProductoPicking, 'cdc') private picRepoCDC:Repository<ProductoPicking>,
        @InjectRepository(ProductoPicking, 'cmp') private picRepoCMP:Repository<ProductoPicking>,
        @InjectRepository(Picking, 'alm') private picRepoDES:Repository<Picking>,
    ){}

    private getRepo(empresa:string){
        if(empresa==='cdc') return this.picRepoCDC
        if(empresa==='cmp') return this.picRepoCMP
        return null
    }
    
    buildQuery(empresa:string){
        const repo = this.getRepo(empresa);
        if(repo!==null){
            return repo.createQueryBuilder('pic')
            .select('pic.nombre')
            .addSelect('pic.codigo')
            .addSelect('mov.id')
            .addSelect('mov.unidadesCapturadas')
            //.addSelect('doc.serie')
            //.addSelect('doc.folio')
            .leftJoin('pic.movimientos', 'mov')
            .leftJoin('mov.idDocumento', 'doc')
        }
        return null;
    }

    async calcular(empresa:string, serie:string, folioI:number, folioF:number){
        const repo = this.buildQuery(empresa);
        if(repo===null)return {mensaje:'La empresa seleccionada no es válida'}
        try {
            return await repo.where('doc.serie = :serie')
                .andWhere('doc.folio >= :folioI')
                .andWhere('doc.folio <= :folioF')
                //.addSelect('pic.conteo')
                .setParameters({serie, folioI, folioF})
                .orderBy('pic.nombre')
                .getMany();
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal calculando el Pickin, informar a sorte tecnico'}
        }
    }

    async concentrar(filtros:seccion[], empresa:string){
        const repo = this.buildQuery(empresa);
        if(repo===null)return {mensaje:'La empresa seleccionada no es válida'}
        try {
            filtros.forEach((filtro, index)=>{
                repo.orWhere(`
                    (doc.serie = :serie${index} AND doc.folio >= :folioI${index} AND doc.folio <= :folioF${index})
                `,{
                    ['serie'+index]:filtro['serie'],
                    ['folioI'+index]:filtro['folioI'],
                    ['folioF'+index]:filtro['folioF'],
                })
            })
            return repo.orderBy('pic.nombre').getMany();
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal calculando el Pickin, informar a sorte tecnico'}
        }
    }

    async reducir(filtros:seccion[]){
        try {
            return await this.picRepoCMP.query(`SELECT NOMBRE AS nombre
            ,SUM(UNIDADES) AS conteo
            ,CODIGO AS codigo
            FROM (${this.buildConteo('cdc',filtros)}
            UNION
            ${this.buildConteo('cmp', filtros)}) qr
            GROUP BY nombre
            ,codigo
            ORDER BY nombre
            `) 
                
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal calculando el Pickin, informar a sorte tecnico'}
        }
    }

    private buildFIltros(filtros:seccion[]){
        const end = filtros.length;
        if(end===0)return '';
        const filtro = filtros[0];
        const sentence =  `(CSERIEDOCUMENTO = '${filtro['serie']}' AND CFOLIO >= ${filtro['folioI']} AND CFOLIO <= ${filtro['folioF']}) `
        const result = sentence + `${end===1?'':'OR'}`;
        filtros.splice(0,1);
        return `${result}${this.buildFIltros(filtros)}`;
    }

    private buildConteo(db:'cdc'|'cmp', filtros:seccion[]){
        const dbname = db==='cdc'?process.env.DB_NAME_CDC:process.env.DB_NAME_CMP;
        const filtros2 = filtros.map(item=>item);
        return `SELECT CNOMBREPRODUCTO AS NOMBRE
            ,CUNIDADESCAPTURADAS AS UNIDADES
            ,CSERIEDOCUMENTO AS SERIE
            ,CFOLIO AS FOLIO
            ,CCODIGOPRODUCTO AS CODIGO
        FROM ${dbname}.dbo.admProductos pro
        LEFT JOIN ${dbname}.dbo.admMovimientos mov
        ON mov.CIDPRODUCTO = pro.CIDPRODUCTO
        LEFT JOIN ${dbname}.dbo.admDocumentos doc
        ON mov.CIDDOCUMENTO= doc.CIDDOCUMENTO
        WHERE ${this.buildFIltros(filtros2)}`
    }

    async create(filtros:seccion[], empresa:string, ruta:string){
        const lista = await this.concentrar(filtros, empresa);
        if(lista['mensaje']===undefined){
            const array = lista as ProductoPicking[];
            const today = new Date();
            const picking = this.picRepoDES.create();
            picking.fecha = today;
            picking.ruta = ruta;
            picking.empresa = empresa;
            picking.detalles = new Array();
            picking.rangos = new Array();
            filtros.forEach(filtro=>{
                const rango = new PickingRango();
                rango.serie=filtro.serie;
                rango.folioI=filtro.folioI
                rango.folioF=filtro.folioF;
                picking.rangos.push(rango)
            })
            array.forEach(pp=> {
                const detalle = new PickingDetalle();
                detalle.codigo = pp.codigo;
                detalle.cantidad = pp.conteo;
                picking.detalles.push(detalle);
            });
            try {
                await this.picRepoDES.save(picking);
                return 'Picking guardado con exito';   
            } catch (error) {
                console.log(error);
                return {mensaje:'Algo salio mal creando el picking, informar a soporte tecico'}
            }
        }else return lista;
    }

    async read(ruta:string, fechaI:string, fechaF:string, empresa:string){
        const builder = this.picRepoDES.createQueryBuilder('pic')
            .select('pic.id')
            .addSelect('pic.fecha')
            .addSelect('pic.ruta')
            .addSelect('pic.nombre')
            .addSelect('pic.empresa')
            .addSelect('ran.serie')
            .addSelect('ran.folioI')
            .addSelect('ran.folioF')
            .addSelect('det.codigo')
            .addSelect('det.cantidad')
            .addSelect('det.nombreCDC')
            .addSelect('det.nombreCMP')
            .leftJoin('pic.rangos', 'ran')
            .leftJoin('pic.detalles', 'det');
        if(ruta!==undefined)
            builder.andWhere('pic.ruta = :ruta', {ruta})
        if(empresa!==undefined)
            builder.andWhere('pic.empresa = :empresa', {empresa})
        if(fechaI!==undefined)
            builder.andWhere('pic.fecha >= :fechaI', {fechaI})
        if(fechaF!==undefined)
            builder.andWhere('pic.fecha <= :fechaF', {fechaF})
        try {
            const lista = await builder.getMany();
            lista.forEach(pic=>{
                pic.detalles = pic.detalles.map(det=>{
                    if(pic.empresa==='cdc')det.nombre = det.nombreCDC
                    if(pic.empresa==='cmp')det.nombre = det.nombreCMP
                    return det;
                })
            })
            return lista;
        } catch (error) {
            console.log(error);
            return {mensaje:'Algo salio mal en la consulta, reportar a soporte tecnico'}
        }

    }

    async update(){

    }
}