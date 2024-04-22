import { IsString, IsOptional, IsNumber} from "class-validator";

export default class RHAgenteDes{
    @IsString()
    @IsOptional()
    nombre:string
    
    @IsString()
    @IsOptional()
    esquema:string

    @IsString()
    @IsOptional()
    estatus:string

    @IsNumber()
    @IsOptional()
    grupo:number

}