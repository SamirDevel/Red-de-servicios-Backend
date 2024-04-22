import { IsString, IsOptional} from "class-validator";
import DocumentoCLienteDto from "./documeto.cliente.dto";

export default class DocumentosDTO extends DocumentoCLienteDto{
    @IsOptional()
    @IsString()
    fechaIS:string

    @IsOptional()
    @IsString()
    fechaFS:string

    @IsOptional()
    @IsString()
    propietario:string

    @IsOptional()
    @IsString()
    agente:string

    @IsOptional()
    @IsString()
    ruta:string

    @IsOptional()
    @IsString()
    restanteIS:string

    @IsOptional()
    @IsString()
    restanteFS:string

    fechaI:Date
    
    fechaF:Date

    restanteI:number

    restanteF:number
}