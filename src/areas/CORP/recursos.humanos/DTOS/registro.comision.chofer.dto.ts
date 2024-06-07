import { IsString, IsNumber, IsArray } from "class-validator";

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
    descuentos:number

    @IsString()
    motivo:string
}