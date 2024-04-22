import { IsString } from "class-validator";

export default class getUserDto{
    @IsString()
    usuario:string;

    @IsString()
    psw:string;
}