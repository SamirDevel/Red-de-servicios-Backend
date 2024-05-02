import * as path from 'path';
import * as fs from 'fs';

export function validatorBool(cadena:string, objeto:string){
    let Flag:null|boolean=null;
        if(cadena ==='true')Flag=true;
        else if(cadena==='false')Flag=false
        else if(cadena!==undefined) throw new Error(`El ${objeto} debe ser un valor booleano`);
    return Flag;
}

export function validarEmpresa(cadena:string):void{
    if(cadena==='cdc'||cadena==='cmp'||cadena==='pei'||cadena==='corp')return;
    else throw new Error('El nombre de la empresa no es valido');
}

export function validarFecha(fecha:string):Date{
    const valida = new Date(`${fecha}T00:00:00`);
    if(!Number.isNaN(valida.getDate()))return valida;
    else throw new Error('Fecha no válido. el formato deberia ser AAAA-MM-DD')
}

export function validarNumero(numero:string):number{
    const valido = parseInt(numero)
    if(!Number.isNaN(valido))return valido;
    else throw new Error('Fecha no valida')
}

export function FechaMayor(fecha1:Date, fecha2:Date){
    let equals = compareNumbers(fecha1.getFullYear(),fecha2.getFullYear())
    if(equals !=='')return equals;
    else{
        equals = compareNumbers(fecha1.getMonth(),fecha2.getMonth())
        if(equals !=='')return equals;
        else return compareNumbers(fecha1.getDate(),fecha2.getDate())
    }
}

function compareNumbers(n1:number, n2:number){
    if(n1>n2)return true;
    else if(n1<n2)return false
    else return '';
}
export async function validar(toExec:Function, cadena:string):Promise<any>{
    try {
        validarEmpresa(cadena);
        return await toExec();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        return JSON.stringify({ error: errorMessage });       
    }
}

export function daysDif(fecha1:Date,fecha2:Date){
    const difTime = fecha1.getTime() - fecha2.getTime();
    const dif = Math.floor(difTime/(1000*60*60*24));
    return dif;
}

export function getApendices(ruta:string){
    try {
        const filePath = path.resolve(process.cwd(), `src/${ruta}.json`);
        const data = fs.readFileSync(filePath, 'utf8');
        const elementos:any[] = JSON.parse(data);
        return elementos
    }catch(error){
        console.log(error)
        return {error:`Error al leer el registro: ${error}`};
    }
}

export function setApendice(ruta:string, elemento:any){
    try {
        const filePath = path.resolve(process.cwd(), `src/${ruta}.json`);
        const lista = getApendices(ruta);
        if(Array.isArray(lista) === false)return lista;
        else{
            (lista as Array<any>).push(elemento);
            const nueva = JSON.stringify(lista, null,2)
            fs.writeFileSync(filePath, nueva, 'utf8');
        }
    } catch (error) {
        console.log(error)
        return {error:`Error al crear el registro: ${error}`};
    }
}
export function setApendices(ruta:string, elementos:any[]){
    try {
        const filePath = path.resolve(process.cwd(), `src/${ruta}.json`);
        const lista = elementos;
        const nueva = JSON.stringify(lista, null,2)
        fs.writeFileSync(filePath, nueva, 'utf8');
        return 'Registros guardados corectamente'
    } catch (error) {
        console.log(error);
        return {mensaje: 'Algo salio mal actualizando los registros'}
    }
}

export function fixed(number:number){
    return parseFloat(number.toFixed(2));
}
function addZeroFirst(number:number){
    return number<10?`0${number}`:number
}
export function dateString(date:Date){
    //const day = new Date();
    return `${date.getUTCFullYear()}-${addZeroFirst(date.getUTCMonth()+1)}-${addZeroFirst(date.getUTCDate())}`
}
export function getToday(){
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    return dateString(today);
}
export * as fns from './funciones'