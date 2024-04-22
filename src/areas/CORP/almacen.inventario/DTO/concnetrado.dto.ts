import { IsString, IsNumber} from "class-validator";

export default class ConcnetradoDTO{
    @IsString()
    serie:string

    @IsNumber()
    folioI:number

    @IsNumber()
    folioF:number
}