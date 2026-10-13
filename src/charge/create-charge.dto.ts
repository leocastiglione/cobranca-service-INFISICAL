import { IsInt, IsNotEmpty, IsNumber,  IsPositive, } from "class-validator";


export class CreateChargeDto {

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    reserva_id!: number;

    @IsNotEmpty()    
    @IsNumber({ maxDecimalPlaces:2})
    cobranca_valor_base!: number;

    
    @IsNumber({ maxDecimalPlaces:2 })
    cobranca_valor_adicional!: number;

    @IsNumber({ maxDecimalPlaces:2 })    
    cobranca_valor_desconto!: number;

    @IsNotEmpty()
    @IsInt()
    cobranca_status!: number;  

}