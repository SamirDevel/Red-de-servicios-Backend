export function validatorBool(cadena:string, objeto:string){
    let Flag:null|boolean=null;
        if(cadena ==='true')Flag=true;
        else if(cadena==='false')Flag=false
        else if(cadena!==undefined) throw new Error(`El ${objeto} debe ser un valor booleano`);
    return Flag;
}