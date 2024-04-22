import { IsArray, IsString, IsNumber} from "class-validator";
interface rangoEsquema{
    id:number
    cantidad:number
    porcentaje:number

}

interface esquema{
    id:number
    nombre:string
    rangos:rangoEsquema[]
}

export default class EsquemaDTO implements esquema{
    @IsNumber()
    id: number;
    
    @IsString()
    nombre: string;

    @IsArray()
    rangos: rangoEsquema[];

}