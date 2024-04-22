import { IsString, IsOptional, IsNumber} from "class-validator";

export default class RHVehiculo{
    @IsString()
    nombre:string;

    @IsString()
    codigo:string;

    @IsString()
    placas:string;

    @IsString()
    aseguradora:string

    @IsString()
    poliza:string;

    @IsString()
    configuracion:string;

    @IsString()
    tipoPermiso:string;

    @IsString()
    numPermiso:string;

    @IsNumber()
    año:number;

    @IsNumber()
    capacidad:number;

    @IsString()
    vigencia:Date;

    @IsString()
    estatus:string;
}