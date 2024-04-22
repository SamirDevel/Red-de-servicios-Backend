import { IsString, IsNumber, IsDateString, IsArray, IsOptional, IsBoolean} from "class-validator";
import DetalleViajeDTO from "./detalleViaje.dto";

export default class ViajeSalidaDTO{
    @IsString()
    empresa:string

    @IsString()
    serie:string

    @IsNumber()
    folio:number
    
    @IsString()
    codChofer:string

    @IsOptional()
    @IsString()
    codAuxiliar:string

    @IsString()
    codVehiculo:string

    @IsString()
    ruta:string

    @IsDateString()
    fechaInicio:Date
    
    @IsNumber()
    dias:number

    @IsString()
    horaInicio:string

    @IsNumber()
    kmInicial:number

    @IsNumber()
    gasInicial:number

    @IsString()
    observacionSalida:string

    @IsArray()
    documentos:DetalleViajeDTO[]

    @IsNumber()
    idUsuario:number;

    @IsBoolean()
    reemplazo:boolean

    @IsOptional()
    @IsNumber()
    folioAnterior:number

    @IsOptional()
    @IsString()
    serieAnterior:string
}