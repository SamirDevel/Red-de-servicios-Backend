import { IsString} from "class-validator";

export default class RHAgente{
    @IsString()
    nombre:string;

    @IsString()
    codigo:string;
}