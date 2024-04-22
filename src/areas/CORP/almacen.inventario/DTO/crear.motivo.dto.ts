import { IsString, IsNumber} from "class-validator";

export default class CrearMotivoDTO{
    @IsString()
    motivo:string

    @IsString()
    descripcion:string
}