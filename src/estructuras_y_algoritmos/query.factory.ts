import { table } from 'console';
import { ObjectLiteral, SelectQueryBuilder} from 'typeorm';

type tabla = 'Documento'|'Externo'|'Domicilio'|
'Agente'|'Asoc'|'Pagos'|'Ruta'|'Clasificacion';

type DocumentoCol = 'id'|'serie'|'folio'
|`expedicion`|'vencimientoReal'|'neto'|'total'
|'pendiente'|'atraso'|'unidades'|'idModelo'
|'idConcepto'|'cancelado';

type ExternoCol = 'id'|'codigo'|'nombre'
|`razonSocial`|'rfc'|'curp'|'txt3';

type DomCol = 'tipoDireccion'|'interior'|
'exterior'|'codigoPostal'|'pais'|'estado'|
'ciudad'|'municipio'|'tipoCatalogo'

type AgenteCol = 'id'|'codigo'|'nombre';

type AsocCol = 'id'|'idCargo'|'idAbono'|'importeAbono'|'fechaAbono';

type ClasifValCol = 'id'|'valor'|'codigo'|'idClasificacion'

type columnas = DocumentoCol|ExternoCol|AgenteCol|AsocCol|DomCol|ClasifValCol

interface columna{
    nombre:tabla
    columna:columnas
}

interface filtro{
    origen:columna, 
    alias:string, 
    value:any, 
    operador?:string,
    opcional:Boolean,
}

interface bloque{
    filtro:string
    opcional:Boolean
    valor:any
    alias:string
}

export default class QueryFactory<T>{
    private alias:string

    private bloquesPropios:bloque[];
    private bloquesExtras:bloque[];
    private builder:SelectQueryBuilder<T>

    constructor(builder:SelectQueryBuilder<T>){ 
        this.alias = (builder.expressionMap.mainAlias!.metadata.target as Function).name;
        this.bloquesPropios= [];
        this.bloquesExtras= [];
        this.builder = new SelectQueryBuilder<T>(builder)
    }
    
    get query():SelectQueryBuilder<T>{
        this.filter()
        return this.builder
    }

    get pureQuery(){
        return this.builder
    }

    get getMany(){
        this.filter()
        return this.builder.getMany()
    }

    get getOne(){
        this.filter()
        return this.builder.getOne()
    }

    private comprobar(destino:string, columna:string, union?:string, origen?:string):string{
        let owner:string='';
        this.alias===destino
            ?(owner=this.alias,this.builder.select(`${owner}.${columna}`))
            :(owner=destino,this.builder.addSelect(`${owner}.${columna}`).leftJoin(`${origen!==undefined?origen:this.alias}.${union}`,`${owner}`))
        return owner;
    }

    docs():QueryFactory<T>{ 
        const owner:string = this.comprobar('Documento','id');
        this.builder.addSelect(`${owner}.serie`)
        .addSelect(`${owner}.folio`)
        .addSelect(`${owner}.idConcepto`)
        .addSelect(`${owner}.idModelo`)
        .addSelect(`${owner}.expedicion`)
        .addSelect(`${owner}.vencimientoReal`)
        .addSelect(`${owner}.neto`)
        .addSelect(`${owner}.total`)
        .addSelect(`${owner}.pendiente`)
        .addSelect(`${owner}.atraso`)
        .addSelect(`${owner}.unidades`)
        .addSelect(`${owner}.idModelo`)
        this.createColumna('Documento','cancelado',true)({alias:'cancelado',operador:undefined,value:0,opcional:false})
        //.andWhere(`${owner}.cancelado = :cancelado`,{cancelado:0})
        return this;
    }

    pagos():QueryFactory<T>{
        const owner:string = this.comprobar('Asoc','id', 'pagos', 'Documento');
        this.builder.addSelect(`${owner}.importeAbono`)
        .addSelect(`${owner}.fechaAbono`)
        const pagos: string = this.comprobar('Pagos','serie', 'idAbono', 'Asoc');
        this.builder.addSelect(`${pagos}.vencimientoReal`)
        .addSelect(`${pagos}.folio`)
        .addSelect(`${pagos}.total`)
        .addSelect(`${pagos}.idConcepto`)
        .addSelect(`${pagos}.idModelo`)
        .addSelect(`${pagos}.expedicion`)
        this.createColumna('Pagos','cancelado',true)({alias:'cancelado',operador:undefined,value:0,opcional:true})
        this.createColumna('Asoc','idAbono',true)({alias:'abono',operador:'IS NULL',value:null,opcional:true})
        //.andWhere(`(${pagos}.cancelado = :cancelado OR ${owner}.idAbono IS NULL)`,{cancelado:0})
        return this
    }

    clients():QueryFactory<T>{
        const owner:string = this.comprobar('Externo','id', 'idCliente');
        this.builder.addSelect(`${owner}.codigo`)
        .addSelect(`${owner}.nombre`)
        .addSelect(`${owner}.razonSocial`)
        .addSelect(`${owner}.rfc`)
        .addSelect(`${owner}.curp`)
        .addSelect(`${owner}.ruta`)
        .addSelect(`${owner}.estatus`)
        .addSelect(`${owner}.diasCreditoCliente`)
        .addSelect(`${owner}.clasificacionClienteReal`)
        return this
    }

    doms(entrega?:boolean):QueryFactory<T>{
        const owner:string = this.comprobar('Domicilio','id', 'domicilios','Externo');
        this.builder.addSelect(`${owner}.tipoDireccion`)
            .addSelect(`${owner}.calle`)
            .addSelect(`${owner}.interior`)
            .addSelect(`${owner}.exterior`)
            .addSelect(`${owner}.codigoPostal`)
            .addSelect(`${owner}.pais`)
            .addSelect(`${owner}.estado`)
            .addSelect(`${owner}.ciudad`)
            .addSelect(`${owner}.municipio`);
        if(entrega!==undefined){
            this.createColumna('Domicilio','tipoDireccion',true)
                ({
                    alias:'tipo',operador:undefined,value:entrega===true
                        ?1
                        :0
                    ,opcional:false
                })
            //this.builder.andWhere(`${owner}.tipoDireccion = :tipo`,{tipo:entrega===true?1:0})
        };
        return this;
    }

    rutas(){
        const owner:string = this.comprobar('Ruta','id', 'clasificacionCliente1', 'Externo');
        this.builder.addSelect(`${owner}.valor`)
        .addSelect(`${owner}.codigo`)
        return this
    }
    
    clasificacion(empresa:'cdc'|'cmp'){
        const owner:string = this.comprobar('Clasificacion','id', `${empresa==='cdc'?'clasificacionCliente2':'clasificacionCliente4'}`, 'Externo');
        this.builder.addSelect(`${owner}.valor`)
        .addSelect(`${owner}.codigo`)
        return this
    }

    agents(){
        const owner:string = this.comprobar('Agente','id', 'idAgente', 'Documento');
        this.builder.addSelect(`${owner}.codigo`)
        .addSelect(`${owner}.nombre`)
        return this
    }

    private filter(){
        const values = {}
        function groupBlocks(bloques){
            let cad = '';
            const end = bloques.length;
            for(let i=0; i<end; i++){
                cad += ` ${bloques[i]['filtro']} `;
                if(i+1<end)
                    cad += ` ${bloques[i+1]['opcional']===true?'OR':'AND'} `

                values[bloques[i]['alias']] = bloques[i]['valor'];
            }
            return `(${cad})`;
        }
        const propios = groupBlocks(this.bloquesPropios);
        if(propios!=='()')this.builder.andWhere(propios,values)
        this.bloquesPropios = []
        const extras = groupBlocks(this.bloquesExtras);
        if(extras!=='()')this.builder.andWhere(extras,values)
        this.bloquesExtras = []
    }

    private addFilter(filtro:filtro, propio:boolean){
        const cad = `${filtro.origen.nombre}.${filtro.origen.columna} ${filtro.operador!==undefined?filtro.operador:'='} ${filtro.value===null?'':`:${filtro.alias}`}`
        const bloque:bloque = {
            filtro:cad,
            valor:filtro.value,
            opcional:filtro.opcional,
            alias:filtro.alias
        }
        propio===true
        ?this.bloquesPropios.push(bloque)
        :this.bloquesExtras.push(bloque)
        //this.query.andWhere(cad,obj);
    }

    private createColumna(bloque:tabla, col:columnas, propio:boolean){
        const origen:columna = {
            nombre:bloque,
            columna:col
        }
        const This = this
        return function createFilter({alias, value, operador, opcional}){
            const filtro:filtro = {
                origen,
                alias,
                value,
                operador,
                opcional
            }
            This.addFilter(filtro,propio)
            return This;
        }
    }

    private createCol(bloque:tabla, col:columnas){
        return this.createColumna(bloque,col,false);
    }

    filterBy(bloque:tabla){
        return (col:columnas)=>this.createCol(bloque,col)
    } 

}