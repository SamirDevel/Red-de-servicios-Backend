import { Entity,  VirtualColumn, AfterLoad} from "typeorm";
import Producto from "src/entidades/entidadesCORP/productos.entity";

@Entity({name:'admProductos'})
export default class ProductoPicking extends Producto{
    /*@VirtualColumn({query: (alias)=>
       })*/
    conteo:number

    @AfterLoad()
    contar(){
        if(this.movimientos !== undefined){
            let contador = 0;
            this.movimientos.forEach(mov=>{
                contador += mov.unidadesCapturadas
            })
            this.conteo = contador ;
        }else this.conteo = 0
    }

    static getConteo(dbName:string, alias:string){
        `SELECT SUM(CUNIDADES)
        FROM ${dbName}.dbo.admMovimientos movs
        LEFT JOIN ${dbName}.dbo.admDocumentos docs
        ON docs.CIDDOCUMENTO = movs.CIDDOCUMENTO
        WHERE ${dbName}.dbo.${alias}.CIDPRODUCTO = admMovimientos.CIDPRODUCTO
        AND admDocumentos.CSERIEDOCUMENTO = :serie
        AND admDocumentos.CFOLIO >= :folioI
        AND admDocumentos.CFOLIO <= :folioF`
    }


}