import { IsNumber, IsString } from "class-validator";
export default class PenalizacionVentasDTO{
    @IsString()
    motivo:string

    @IsNumber()
    valor:number
}