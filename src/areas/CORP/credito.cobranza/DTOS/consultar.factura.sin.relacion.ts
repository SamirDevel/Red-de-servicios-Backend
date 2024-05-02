import { IsString, IsOptional, IsNumberString, IsDateString} from "class-validator";

export default class ConsultarFacturaSnRelacionDTO{
    @IsOptional()
    @IsString()
    serie:string

    @IsOptional()
    @IsNumberString()
    folio:number

    @IsOptional()
    @IsString()
    cliente:string

    @IsOptional()
    @IsDateString()
    fechaI:string

    @IsOptional()
    @IsDateString()
    fechaF:string
}