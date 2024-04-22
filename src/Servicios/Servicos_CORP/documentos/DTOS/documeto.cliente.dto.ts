import { IsString, IsOptional} from "class-validator";


export default class DocumentoCLienteDto{
    @IsString()
    @IsOptional()
    cliente:string;

    @IsString()
    @IsOptional()
    dom:string;
}