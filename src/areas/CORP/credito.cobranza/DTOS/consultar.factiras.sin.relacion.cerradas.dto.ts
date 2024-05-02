import { IsString, IsOptional, IsNumberString, IsDateString} from "class-validator";

export default class ConsultarFacturaSnRelacionCerradasDTO{
    @IsOptional()
    @IsString()
    serie:string

    @IsOptional()
    @IsNumberString()
    folio:number

    @IsOptional()
    @IsDateString()
    fechaI:Date

    @IsOptional()
    @IsDateString()
    fechaF:Date

    @IsOptional()
    @IsString()
    cliente:string
}