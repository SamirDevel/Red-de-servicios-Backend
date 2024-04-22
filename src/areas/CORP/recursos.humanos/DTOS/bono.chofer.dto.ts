import {IsString, IsNumber} from "class-validator";

export default class BonoChoferDTO{
    
    @IsString()
    nombre: string;

    @IsNumber()
    valor: number;

}