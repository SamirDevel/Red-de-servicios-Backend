import { IsString, IsNumber, IsDateString} from "class-validator";

export default class DetalleViajeDTO{
    @IsString()
    empresa:string

    @IsString()
    serie:string

    @IsNumber()
    folio:number

    @IsString()
    destino:string

    @IsString()
    observaciones:string
    
    @IsString()
    direccion:string
}