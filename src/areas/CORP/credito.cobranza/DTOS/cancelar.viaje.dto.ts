import { IsString} from "class-validator";

export default class CancelarViajeDTO{
    @IsString()
    motivo:string

    @IsString()
    responsable:string
}