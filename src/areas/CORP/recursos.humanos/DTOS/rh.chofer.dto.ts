import { IsString, IsOptional, IsNumber} from "class-validator";

export default class RHChofer{    
    @IsString()
    nombre:string;

    @IsString()
    codigo:string;

    @IsString()
    rfc:string

    @IsString()
    licencia:string

    @IsString()
    calle:string

    @IsString()
    exterior:string

    @IsOptional()
    @IsString()
    interior:string

    @IsString()
    colonia:string

    @IsString()
    cp:string

    @IsString()
    municipio:string

    @IsString()
    ciudad:string

    @IsString()
    estado:string

    @IsString()
    pais:string
    
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

    @IsString()
    estatus:'ACTIVO'|'INACTIVO'

    @IsNumber()
    tipo:number
}