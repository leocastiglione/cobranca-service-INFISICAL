import { IsInt, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";



export class CreatePaymentDto {


    
    @IsInt()
    @IsNotEmpty()
    usuario_id!: number;

    @IsInt()
    @IsNotEmpty()
    cobranca_id!: number;

    @IsOptional()
    @IsInt()
    pagamento_forma!: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2})
    pagamento_valor!: number;

    @IsOptional()
    @IsString()
    pagamento_pago_em!: string;


    @IsOptional()
    @IsString()
    @MaxLength(150)
    pagamento_transacao_externa_id!: string;

    @IsOptional()
    @IsInt()
    pagamento_status!: number;




}