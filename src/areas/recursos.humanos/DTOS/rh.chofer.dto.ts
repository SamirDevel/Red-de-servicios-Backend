import RHAgente from "./rh.agente.dto";
import { IsString, IsOptional} from "class-validator";

export default class RHChofer extends RHAgente{
    @IsString()
    calle:string

    @IsString()
    rfc:string

    @IsString()
    licencia:string

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
    pais:string

    @IsString()
    ciudad:string

    @IsString()
    municipio:string
}