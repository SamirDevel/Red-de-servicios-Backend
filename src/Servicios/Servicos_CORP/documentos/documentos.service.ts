import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { empresa } from 'src/entidades/entidadesCORP/tiposDatos';
import Documento from 'src/entidades/entidadesCORP/documentos.entity';
import DocumentosDTO from './DTOS/documentos.filtros.dto';
import QueryFactory from 'src/estructuras_y_algoritmos/query.factory';

@Injectable()
export class DocumentosService {
    constructor(
        @InjectRepository(Documento,'cdc') private docRepoCDC:Repository<Documento>,
        @InjectRepository(Documento,'cmp') private docRepoCMP:Repository<Documento>
    ){     }

    private selecionarBase(bdname:string):Repository<Documento>{
        if(bdname==='cdc'){
            return this.docRepoCDC;
        }else if(bdname==='cmp'){
            return this.docRepoCMP;
        }else{
            return null;
        };
    }

    private async queryBase(builder:Repository<Documento>) {
        const factory = new QueryFactory(builder.createQueryBuilder());
        return factory.docs();
    }

    async clientData(builder:SelectQueryBuilder<Documento>){
        const factory = new QueryFactory(builder);
        return factory.clients().query;
    }

    async domData(builder:SelectQueryBuilder<Documento>, entrega?:boolean){
        //console.log('entra')
        const factory = new QueryFactory(builder);
        //return factory.doms(entrega).query.andWhere('Domicilio.tipoCatalogo = :tipoCatalogo',{tipoCatalogo:1})
        return factory.doms(entrega).filterBy('Domicilio')('tipoCatalogo')({
            alias:'tipoCat',
            value:1,
            operador:undefined,
            opcional:false
        }).query
    }
    
    async agentData(builder:SelectQueryBuilder<Documento>){
        const factory = new QueryFactory(builder);
        return factory.agents().query;
    }

    async getOne(bdname:empresa, serie:string, folio:number){
        
        let result:QueryFactory<Documento>=null;
        const builder = this.selecionarBase(bdname);
        result = (await this.queryBase(builder));
        //console.log(result)
        return result.filterBy('Documento')
                ('serie')
                    ({
                        alias:'serie',
                        value:serie,
                        opcional:false,
                        operador:undefined
                    })
            .filterBy('Documento')
                ('folio')
                ({
                    alias:'folio',
                    value:folio,
                    opcional:false,
                    operador:undefined
                }).query
    }

    async getList(bdname:empresa, filtros:DocumentosDTO){
        let result:QueryFactory<Documento>=null;
        const builder = this.selecionarBase(bdname);
        result = (await this.queryBase(builder));
        if(filtros.fechaI!==undefined)
            result.filterBy('Documento')('expedicion') ({
                alias:'fechaI',
                value:filtros.fechaI,
                operador:'>=',
                opcional:false
            })
        if(filtros.fechaF!==undefined)
            result.filterBy('Documento')('expedicion') ({
                alias:'fechaF',
                value:filtros.fechaF,
                operador:'<=',
                opcional:false
            })    
        if(filtros.propietario !== undefined){            
            result.filterBy('Externo')('razonSocial')({
                alias:'cliente',
                value: filtros.propietario,
                operador:undefined,
                opcional:true
            })
            
            result.filterBy('Externo')('txt3')({
                alias:'txt',
                value: filtros.propietario,
                operador:undefined,
                opcional:true
            })  
        }
        if(filtros.agente!==undefined)
        result.filterBy('Agente')('nombre')({
            alias:'agente',
            value: filtros.agente,
            operador:undefined,
            opcional:false
        })    
        //console.log(result)

        return result.query
    }

    async getSeries(bdname:empresa){
        const builder = this.selecionarBase(bdname);
        return builder.query(`SELECT [CSERIEPOROMISION] AS nombre
        FROM admConceptos
        WHERE [CUSAREFERENCIA] = 4
        AND CIDDOCUMENTODE = 4`);
    }

    async getRutas(bdname:empresa){
        const builder = this.selecionarBase(bdname);
        return builder.query(`SELECT [CIDVALORCLASIFICACION] AS id
           ,[CVALORCLASIFICACION] AS nombre
           , [CCODIGOVALORCLASIFICACION] AS codigo
           ,[CSEGCONT1] as tipo
        FROM [admClasificacionesValores]
        WHERE [CIDCLASIFICACION] = 7
        ORDER BY nombre`);
    }
}
