import { IsString, IsOptional} from "class-validator";


export default class CLienteDomicilioDto{
    @IsString()
    @IsOptional()
    domicilio:string;
}