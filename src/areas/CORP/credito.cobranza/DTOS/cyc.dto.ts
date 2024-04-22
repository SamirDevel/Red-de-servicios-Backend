import { IsString, IsOptional} from "class-validator";
import DocumentosDTO from 'src/Servicios/Servicos_CORP/documentos/DTOS/documentos.filtros.dto';

export default class cycDTO extends DocumentosDTO{
    @IsOptional()
    @IsString()
    list:string

    @IsOptional()
    @IsString()
    concepto:string

    @IsOptional()
    @IsString()
    clasificacion:string
    
    @IsOptional()
    @IsString()
    rutas:string

    rutasList:string[]
}
