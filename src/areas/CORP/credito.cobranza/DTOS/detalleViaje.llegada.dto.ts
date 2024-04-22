import { IsString, IsNumber, IsNumberString} from "class-validator";

export default class DetalleViajeLlegadaDTO{
    @IsString()
    empresa:string

    @IsString()
    serie:string

    @IsNumber()
    folio:number

    @IsNumber()
    importe:number
}