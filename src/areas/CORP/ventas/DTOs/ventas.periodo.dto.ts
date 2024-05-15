import { IsDateString, IsOptional } from "class-validator";

export default class VentasPeriodoDTO{
    @IsOptional()
    @IsDateString()
    fechaI:Date

    @IsOptional()
    @IsDateString()
    fechaF:Date
}