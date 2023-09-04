export function validatorBool(cadena:string, objeto:string){
    let Flag:null|boolean=null;
        if(cadena ==='true')Flag=true;
        else if(cadena==='false')Flag=false
        else if(cadena!==undefined) throw new Error(`El ${objeto} debe ser un valor booleano`);
    return Flag;
}

export function validarEmpresa(cadena:string):void{
    if(cadena==='cdc'||cadena==='cmp'||cadena==='corp')return;
    else throw new Error('El nombre de la empresa no es valido');
}

export function validarFecha(fecha:string):Date{
    const valida = new Date(fecha);
    if(!Number.isNaN(valida.getDate()))return valida;
    else throw new Error('Fecha no válido. el formato deberia ser AAAA-MM-DD')
}

export function validarNumero(numero:string):number{
    const valido = parseInt(numero)
    if(!Number.isNaN(valido))return valido;
    else throw new Error('Fecha no valida')
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