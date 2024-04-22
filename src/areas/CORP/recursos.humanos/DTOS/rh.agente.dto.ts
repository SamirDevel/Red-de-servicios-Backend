import { IsString, IsNumber} from "class-validator";

export default class RHAgente{
    @IsString()
    nombre:string;

    @IsNumber()
    tipo:number;
}