import { IsString, IsOptional, IsNumber, IsDateString} from "class-validator";

export default class RHChofer{    
    @IsOptional()
    @IsString()
    nombre:string;

    @IsOptional()
    @IsString()
    codigo:string;

    @IsOptional()
    @IsString()
    rfc:string

    @IsOptional()
    @IsString()
    licencia:string

    @IsOptional()
    @IsString()
    calle:string

    @IsOptional()
    @IsString()
    exterior:string

    @IsOptional()
    @IsString()
    interior:string

    @IsOptional()
    @IsString()
    colonia:string

    @IsOptional()
    @IsString()
    cp:string

    @IsOptional()
    @IsString()
    municipio:string

    @IsOptional()
    @IsString()
    ciudad:string

    @IsOptional()
    @IsString()
    estado:string

    @IsOptional()
    @IsString()
    pais:string
    
    @IsOptional()
    @IsString()
    telefono:string

    @IsOptional()
    @IsString()
    telefono2:string

    @IsOptional()
    @IsString()
    telefono3:string

    @IsOptional()
    @IsString()
    telefono4:string

    @IsOptional()
    @IsString()
    estatus:'ACTIVO'|'INACTIVO'

    @IsOptional()
    @IsNumber()
    tipo:number

    @IsOptional()
    @IsDateString()
    vigencia:Date
}