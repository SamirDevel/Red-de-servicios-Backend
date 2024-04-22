import { IsString, IsNumberString, IsOptional} from "class-validator";

export default class ValidacionPickingDTO{
    @IsOptional()
    @IsString()
    serie:string

    @IsOptional()
    @IsNumberString()
    folioI:number

    @IsOptional()
    @IsNumberString()
    folioF:number

    @IsOptional()
    @IsNumberString()
    costoI:number

    @IsOptional()
    @IsNumberString()
    costoF:number

    @IsOptional()
    @IsNumberString()
    pendienteI:number

    @IsOptional()
    @IsNumberString()
    pendienteF:number

    @IsOptional()
    @IsString()
    razonS:number

    @IsOptional()
    @IsNumberString()
    estado:number
}