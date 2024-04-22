import { IsDateString, IsNumber, IsOptional, IsString} from "class-validator";
import CancelarViajeDTO from "./cancelar.viaje.dto";

export default class ActualizarViajeDTO extends CancelarViajeDTO{

    @IsOptional()
    @IsString()
    chofer:string

    @IsOptional()
    @IsString()
    auxiliar:string

    @IsOptional()
    @IsString()
    auto:string

    @IsOptional()
    @IsString()
    vehiculo:string

    @IsOptional()
    @IsString()
    ruta:string
    
    @IsOptional()
    @IsNumber()
    kmInicial:number

    @IsOptional()
    @IsDateString()
    fechaInicio:Date

    @IsOptional()
    @IsString()
    horaInicio:string

    @IsOptional()
    @IsNumber()
    dias:number

    @IsOptional()
    @IsString()
    observacionesSalida:string

    @IsOptional()
    @IsNumber()
    gasInicial:number

    @IsOptional()
    @IsNumber()
    kmFinal:number

    @IsOptional()
    @IsDateString()
    fechaFin:Date

    @IsOptional()
    @IsString()
    horaFin:string

    @IsOptional()
    @IsNumber()
    cargas:number

    @IsOptional()
    @IsString()
    observacionesLlegada:string

    @IsOptional()
    @IsNumber()
    gasFinal:number
}