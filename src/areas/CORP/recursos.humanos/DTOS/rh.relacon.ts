import { IsString} from "class-validator";

export default class RHRelacion{
    @IsString()
    admin:string;

    @IsString()
    dependiente:string;
}