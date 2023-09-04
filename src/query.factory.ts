import { ObjectLiteral, SelectQueryBuilder} from 'typeorm';

type tabla = 'Documento'|'Externo'|'Domicilio'|
'Agente'|'Asoc'|'Pagos';

type DocumentoCol = 'id'|'serie'|'folio'
|`expedicion`|'vencimientoReal'|'neto'|'total'
|'pendiente'|'atraso'|'unidades'|'idModelo'
|'idConcepto';

type ExternoCol = 'id'|'codigo'|'nombre'
|`razonSocial`|'rfc'|'curp'|'txt3';

type AgenteCol = 'id'|'codigo'|'nombre';

type AsocCol = 'id'|'idCargo'|'idAbono'|'importeAbono'|'fechaAbono';


interface columna{
    nombre:tabla
    columna:DocumentoCol|ExternoCol|AgenteCol|AsocCol
}

interface filtro{
    origen:columna, 
    alias:string, 
    value:any, 
    operador?:string,
}

export default class QueryFactory<T>{
    private alias:string

    private bloques:tabla[]

    constructor(private builder:SelectQueryBuilder<T>){ 
        this.alias = (builder.expressionMap.mainAlias!.metadata.target as Function).name;

    }
    
    get query():SelectQueryBuilder<T>{
        return this.builder
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
        .addSelect(`${owner}.expedicion`)
        .addSelect(`${owner}.vencimientoReal`)
        .addSelect(`${owner}.neto`)
        .addSelect(`${owner}.total`)
        .addSelect(`${owner}.pendiente`)
        .addSelect(`${owner}.atraso`)
        .addSelect(`${owner}.unidades`)
        .andWhere(`${owner}.cancelado = :cancelado`,{cancelado:0})
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
        .andWhere(`(${pagos}.cancelado = :cancelado OR ${owner}.idAbono IS NULL)`,{cancelado:0})
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
        .addSelect(`${owner}.clasificacionClienteReal`)
        return this
    }

    doms(entrega?:boolean):QueryFactory<T>{
        const owner:string = this.comprobar('Domicilio','tipoDireccion', 'domicilios','Externo');
        this.builder.addSelect(`${owner}.calle`)
            .addSelect(`${owner}.interior`)
            .addSelect(`${owner}.exterior`)
            .addSelect(`${owner}.codigoPostal`)
            .addSelect(`${owner}.pais`)
            .addSelect(`${owner}.estado`)
            .addSelect(`${owner}.ciudad`)
            .addSelect(`${owner}.municipio`);
        if(entrega!==undefined)this.builder.andWhere(`${owner}.tipoDireccion = :tipo`,{tipo:entrega===true?1:0});
        return this;
    }

    agents(){
        const owner:string = this.comprobar('Agente','id', 'idAgente');
        this.builder.addSelect(`${owner}.codigo`)
        .addSelect(`${owner}.nombre`)
        return this
    }

    filterBy( filtro:filtro|filtro[]){
        let cad = ``
        let obj = {};
        if(Array.isArray(filtro)){
            const end = filtro.length;
            if(end>0){    
                cad = '(';
                obj = {}
                for(let i=0; i<end; i++){
                    cad += ` ${filtro[i].origen.nombre}.${filtro[i].origen.columna} ${filtro[i].operador!==undefined?filtro[i].operador:'='} ${filtro[i].value===null?'':`:${filtro[i].alias}`}`;
                    if(i<(end-1))cad += ' OR ';
                    obj[filtro[i].alias] = filtro[i].value;
                }
                cad+=')'
            }
        }else{
            cad = `${filtro.origen.nombre}.${filtro.origen.columna} ${filtro.operador!==undefined?filtro.operador:'='} ${filtro.value===null?'':`:${filtro.alias}`}`
            obj = {};
            obj[filtro.alias] = filtro.value
        }
        this.query.andWhere(cad,obj);
        return this;
        
    }   
}