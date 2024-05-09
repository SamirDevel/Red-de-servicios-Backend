import { 
    IsString, 
    IsOptional, 
    IsNumber, 
    IsEmail, 
    IsBoolean, 
    IsPhoneNumber,
    isNotEmpty,
    ValidateIf,
    IsNumberString,
} from "class-validator";

export default class ModificarClienteDTO{
    
    @IsOptional()
    @ValidateIf((value:ModificarClienteDTO)=>{
        return isNotEmpty(value.tel1)
    })
    @IsPhoneNumber('MX')
    tel1:number

    @IsOptional()
    @ValidateIf((value:ModificarClienteDTO)=>{
        return isNotEmpty(value.tel2)
    })
    @IsPhoneNumber('MX')
    tel2:number

    @IsOptional()
    @IsEmail()
    correo:string

    @IsOptional()
    @ValidateIf((value:ModificarClienteDTO)=>{
        return isNotEmpty(value.contrarecivo)
    })
    @IsString()
    contrarecivo:number

    @IsOptional()
    @IsString()
    formaPago:string

    @IsOptional()
    @IsNumber()
    clasificacion:number

    @IsOptional()
    @IsBoolean()
    activo:boolean

    @IsOptional()
    @IsString()
    observacion:string

    @IsOptional()
    @IsNumber()
    diasCredito:number

    @IsOptional()
    @IsNumber()
    limiteCredito:number
    
}