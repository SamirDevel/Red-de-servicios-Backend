import { IsString, IsNumber, IsArray } from "class-validator";
import { IsChar } from "src/estructuras_y_algoritmos/Decorators/IsCHar";

export default class ComisionChoferDTO{
    @IsString()
    chofer:string

    @IsNumber()
    foraneos:number

    @IsNumber()
    pagadoForaneos:number

    @IsNumber()
    aJalisco:number

    @IsNumber()
    pagadoJalisco:number

    @IsNumber()
    paradas:number

    @IsNumber()
    pagadoParadas:number

    @IsNumber()
    auxiliar:number

    @IsNumber()
    pagadoAuxiliar:number

    @IsNumber()
    recalculo:number

    @IsString()
    motivo:string

    @IsChar((char:string)=>char==='+'||char==='-'||char==='', 'char of +, -, or emprty')
    tipoRecalculo:string
    
}