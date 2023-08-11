import { SelectQueryBuilder} from 'typeorm';

export default class QueryFactory<T>{
    private alias:string
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
        const owner:string = this.comprobar('Documento','serie');
        this.builder.addSelect(`${owner}.folio`)
        .addSelect(`${owner}.expedicion`)
        .addSelect(`${owner}.vencimientoReal`)
        .addSelect(`${owner}.neto`)
        .addSelect(`${owner}.total`)
        .addSelect(`${owner}.pendiente`)
        .addSelect(`${owner}.atraso`)
        .addSelect(`${owner}.unidades`)
        return this;
    }

    clients():QueryFactory<T>{
        const owner:string = this.comprobar('Externo','codigo', 'idCliente');
        this.builder.addSelect(`${owner}.nombre`)
        .addSelect(`${owner}.razonSocial`)
        .addSelect(`${owner}.rfc`)
        .addSelect(`${owner}.curp`)
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
        if(entrega!==undefined)this.builder.andWhere(`${owner}.tipoDireccion :tipo`,{tipo:entrega===true?1:0});
        return this;
    }
}