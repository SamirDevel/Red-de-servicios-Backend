import { IsString } from "class-validator";

export default class CrearUsuarioDto{
    @IsString()
    usuario:string;

    @IsString()
    psw:string;
}