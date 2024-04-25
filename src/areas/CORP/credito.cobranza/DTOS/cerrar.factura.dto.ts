import { IsString} from "class-validator";

export default class CerrarFacturaDTO{
    @IsString()
    motivo:string
    
}