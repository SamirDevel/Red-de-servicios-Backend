import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Next } from "@nestjs/common";
import { Observable, combineLatest, concatMap, filter, forkJoin, map, mergeMap, switchMap } from "rxjs";
import { DocumentosService } from "./Servicos_CORP/documentos/documentos.service";
import ListaCorp from "./estructuras_y_algoritmos/lista.corp";

@Injectable()
export class CorpOneInterceptor implements NestInterceptor{
    constructor(private docService:DocumentosService){}
    
    async intercept(context: ExecutionContext, next: CallHandler):Promise<Observable<any>>{
        const request = context.switchToHttp().getRequest();
        try {
            if(request.params['empresa'] ==='corp'){
                let lista:string[] = (await this.docService.getSeries('cdc')).map(item=>item['nombre']);
                if(lista.includes(request.params['serie'])){
                    request.params['empresa'] = 'cdc';
                }
                lista = (await this.docService.getSeries('cmp')).map(item=>item['nombre']);
                if(lista.includes(request.params['serie'])){
                    request.params['empresa'] = 'cmp';
                }
            }
            return next.handle();
        } catch (error) {
            console.log(error);   
        }

    }
}

@Injectable()
export class CorpListInterceptor implements NestInterceptor{
    
    async intercept(context: ExecutionContext, next: CallHandler):Promise<Observable<any>>{
        const request = context.switchToHttp().getRequest();

        if(request.params['empresa'] === 'corp'){
            request.params['empresa'] = 'cdc';
            return next.handle().pipe(
                mergeMap((cdc)=>{
                    request.params['empresa'] = 'cmp'; 
                    //console.log('cdc');
                    //console.log(list.elementos);
                    return next.handle().pipe(
                        map((cmp)=>{
                            //console.log('cmp');
                            return  new ListaCorp(cdc.lista)
                                .fusion(cmp.lista,cmp.fusion)
                                .quickSort(cdc.compare)
                                .elementos;
                        })
                    );
                })
            );
        }
        return next.handle().pipe(map(result=>{
            return result.lista;
        }));
    }
}


//const lista = new ListaCorp(await this.docService.getSeries('cdc'));