import { alias } from 'yargs';

export function UNION(query1:string, query2:string){
    return `${query1}\nUNION\n${query2}`;
}

export function SELECT(array:string[], index:number){
    if(index === array.length){
        return ''
    }else if(index === 0){
        return `SELECT ${array[index]}\n` + SELECT(array, index+1);
    }else {
        return `,${array[index]}\n` + SELECT(array, index+1);
    }
}
export function TOP(array:string[], n:number){
    array[0] = `TOP(${n}) ${array[0]}`;
    return SELECT(array, 0);
}
export function getDB(dbname:string){
    if(dbname === 'cdc')return process.env.DB_NAME_CDC
    if(dbname === 'cmp')return process.env.DB_NAME_CMP
    return ''
}

export function FROM(dbname:string, tabla:string, alias?:string){
    const name = getDB(dbname);
    return `FROM ${name}.dbo.${tabla} ${alias!==undefined?alias:''}\n`;
}
export function FROM_QUERY(str:string, alias:string){
    return `FROM (${str}) ${alias!==undefined?alias:''}\n`;
}

interface tabla{
    tabla:string
    columna:string
}
interface join{
    tabla1:tabla
    tabla2:tabla
}
export function LEFT_JOIN(params:join, alias?:string, dbname?:string){
    const name = getDB(dbname);
    return `LEFT JOIN ${dbname!==undefined?`${name}.dbo.`:''}${params.tabla2.tabla} ${alias!==undefined?alias:''}\n
    ON ${params.tabla1.tabla}.${params.tabla1.columna} = ${alias!==undefined?alias:params.tabla2.tabla}.${params.tabla2.columna}\n`
}
interface condicion{
    tabla:tabla
    condicion:string
    valor:string
}

export function CONDICION(params:condicion){
    return `${params.tabla.tabla}.${params.tabla.columna} ${params.condicion} ${params.valor}\n`
}
export function WHERE(){
    return `WHERE `;
}
export function AND(){
    return `AND `;
}
export function OR(){
    return `OR `;
}
export function ORDERBY(alias:tabla, desc:boolean){
    return `ORDER BY ${alias.tabla}.${alias.columna}\n${desc===true?'DEC':''}`
}

export * as sqlBuilder from './sql.query.builder'