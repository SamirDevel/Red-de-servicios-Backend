import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { empresa } from 'src/entidades/tiposDatos';
import Documento from 'src/entidades/documentos.entity';
import DocumentosDTO from './DTOS/documentos.filtros.dto';
import QueryFactory from '../../query.factory';

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
        return factory.doms(entrega).query.andWhere('Domicilio.tipoCatalogo = :tipoCatalogo',{tipoCatalogo:1})
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

        return result.query.where(`${result.query.alias}.serie = :serie`,{serie})
        .andWhere(`${result.query.alias}.folio = :folio`,{folio});
    }

    async getList(bdname:empresa, filtros:DocumentosDTO){
        let result:QueryFactory<Documento>=null;
        const builder = this.selecionarBase(bdname);
        result = (await this.queryBase(builder));
        if(filtros.fechaI!==undefined)
            result.filterBy({origen:{nombre:'Documento', columna:'expedicion'},alias:'fechaI',value:filtros.fechaI,operador:'>='});
        if(filtros.fechaF!==undefined)
            result.filterBy({origen:{nombre:'Documento', columna:'expedicion'},alias:'fechaF',value:filtros.fechaF,operador:'<='});
        if(filtros.propietario !== undefined){            
            result.filterBy(
                [
                    {
                        origen:{
                            nombre:'Externo',
                            columna:'razonSocial',
                        },
                        alias:'cliente',
                        value: filtros.propietario
                    },
                    {
                        origen:{
                            nombre:'Externo',
                            columna:'txt3',
                        },
                        alias:'txt',
                        value:filtros.propietario
                    },
                ]
            );
            
        }
        if(filtros.agente!==undefined)
            result.filterBy({origen:{nombre:'Agente', columna:'nombre'},alias:'agente',value:filtros.agente});
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
        FROM [admClasificacionesValores]
        WHERE [CIDCLASIFICACION] = 7
        ORDER BY nombre`);
    }
}
