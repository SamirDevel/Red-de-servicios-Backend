import { IsNumber } from "class-validator";

export default class MetaCobranzaDTO{
    @IsNumber()
    meta:number
}