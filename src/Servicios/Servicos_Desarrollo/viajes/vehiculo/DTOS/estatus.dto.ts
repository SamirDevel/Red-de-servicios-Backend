import { IsString, IsOptional } from "class-validator";

export default class EstatusDTO{
    @IsString()
    @IsOptional()
    estatus:string
}