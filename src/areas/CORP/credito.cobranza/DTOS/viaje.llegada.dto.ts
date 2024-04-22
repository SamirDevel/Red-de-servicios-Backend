import { IsString, IsNumberString, IsDateString, IsArray, IsNumber, IsOptional} from "class-validator";
import DetalleViajeLlegadaDTO from "./detalleViaje.llegada.dto";
export default class ViajeLlegadaDTO{
    @IsDateString()
    fechaFin:Date

    @IsString()
    horaFin:string

    @IsNumber()
    kmFinal:number

    @IsNumber()
    gasFinal:number
    
    @IsNumber()
    cargas:number

    @IsOptional()
    @IsString()
    observacionLlegada:string

    @IsArray()
    documentos:DetalleViajeLlegadaDTO[]
}