import { IsString, IsDateString, IsNumberString, IsOptional} from "class-validator";

export default class ConsultaViajeDTO{
    @IsString()
    @IsOptional()
    serie:string

    @IsNumberString()
    @IsOptional()
    folio:number

    @IsString()
    @IsOptional()
    chofer:string

    @IsString()
    @IsOptional()
    vehiculo:string

    @IsString()
    @IsOptional()
    ruta:string

    @IsString()
    @IsOptional()
    auxiliar:string

    @IsString()
    @IsOptional()
    usuario:string

    @IsDateString()
    @IsOptional()
    fechaI:Date

    @IsDateString()
    @IsOptional()
    fechaF:Date

    @IsString()
    @IsOptional()
    estatus:string
}