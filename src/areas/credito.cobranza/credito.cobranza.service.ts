import { Injectable, flatten } from '@nestjs/common';
import { Repository, SelectQueryBuilder} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { empresa } from 'src/entidades/tiposDatos';
import Documento from 'src/entidades/documentos.entity';
import DocumentosDTO from 'src/Servicos_CORP/documentos/DTOS/documentos.filtros.dto';
import QueryFactory from '../../query.factory';
import { DocumentosService } from 'src/Servicos_CORP/documentos/documentos.service';
import ListaCorp from 'src/estructuras_y_algoritmos/lista.corp';

@Injectable()
export class CreditoCobranzaService {
    constructor(private docService:DocumentosService){ }
    async getOne(bdname:empresa, serie:string, folio:number){
        let builder = await this.docService.getOne(bdname, serie,folio)
        builder =  await this.docService.clientData(builder)
        builder = await this.docService.domData(builder);
        const factory = new QueryFactory(builder).pagos();
        return factory.query
    }

    private async filter(bdname:empresa, filtros:DocumentosDTO){
        let builder =  await this.docService.getList(bdname, filtros);
        builder = await this.docService.clientData(builder)
        builder = await this.docService.domData(builder,false);
        builder = await this.docService.agentData(builder);
        builder.andWhere('Documento.idModelo = :mod',{mod:4});
        return builder;
    }
    
    async getList(bdname:empresa, filtros:DocumentosDTO){
        const resultQuery = await this.filter(bdname, filtros)
        resultQuery.andWhere('Documento.pendiente > :p',{p:0});
        const lista = new ListaCorp(await resultQuery.getMany());
        if(filtros.ruta!==undefined){  
            lista.filter(item=>{
                return item['idCliente']['ruta'] === filtros.ruta;
            }).elementos
        }
        if(filtros.restanteI!==undefined){
            //console.log('entra')
            lista.filter(item=>{
                //console.log(item['atraso']<= filtros.restanteI);
                return item['atraso']<= filtros.restanteI
            })
        }
        if(filtros.restanteF!==undefined){
            lista.filter(item=>{
                return item['atraso']>= filtros.restanteF
            })
        }
        return lista.elementos
    }

    async cobranzaTotal(bdname:empresa, filtros:DocumentosDTO){
        filtros.propietario = undefined;
        filtros.restanteI = undefined;
        filtros.restanteF = undefined;
        filtros.restanteIS = undefined;
        filtros.restanteFS = undefined;
        const fechaI = filtros.fechaI
        const fechaF = filtros.fechaF
        filtros.fechaI = undefined;
        filtros.fechaF = undefined;
        const builder = await this.filter(bdname, filtros);
        const factory = new QueryFactory(builder);
        factory.pagos();
        /*factory.filterBy([
            {
                origen:{
                    nombre:'Documento',
                    columna:'idModelo'
                },
                alias:'Modelo',
                value:4
            },
            {
                origen:{
                    nombre:'Documento',
                    columna:'idConcepto'
                },
                alias:'Concepto',
                value:bdname==='cdc'?3045:3048
            }
        ])*/
        factory.filterBy([
            {
                origen:{
                    nombre:'Pagos',
                    columna:'idConcepto'
                },
                alias:'Concepto',
                value:bdname==='cdc'?3015:3016,
                operador: '!='
            },
            {
                origen:{
                    nombre:'Asoc',
                    columna:'idAbono'
                },
                alias:'Abono',
                value:null,
                operador:' IS NULL'
            },
        ])
        const lista = new ListaCorp(await factory.query.getMany());
        return lista.elementos;
    }
}


/* `(
        CASE
            WHEN DB_NAME()='adCENTRAL_MAYORISTA_DE' THEN 3016
            WHEN DB_NAME()='adCOMERCIAL_DOMOS_COPE' THEN 3015
            ELSE NULL
        END
    )`
    `(
        CASE
            WHEN DB_NAME()='adCENTRAL_MAYORISTA_DE' THEN 3038
            WHEN DB_NAME()='adCOMERCIAL_DOMOS_COPE' THEN 3045
            ELSE NULL
        END
    )`        
*/