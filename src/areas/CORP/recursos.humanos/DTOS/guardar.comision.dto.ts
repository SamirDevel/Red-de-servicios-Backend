import { IsString, IsDateString, IsNumber } from "class-validator";
export default class GuardarComisionDTO{
    @IsString()
    agente:string
    
    @IsNumber()
    cobranza:number

    @IsNumber()
    aTiempo:number

    @IsNumber()
    fueraTiempo:number

    @IsString()
    esquema:string
    
    @IsNumber()
    porcentaje:number

    @IsNumber()
    descuentos:number

    @IsNumber()
    anticipo:number
 
    @IsNumber()
    penalizacion:number
}