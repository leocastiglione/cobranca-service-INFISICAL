import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";


export class CreateChargeItemDto {
    @IsInt()
    @IsNotEmpty()
    cobranca_id!: number;

    @IsInt()
    @IsNotEmpty()
    item_cobranca_tipo!: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    item_cobranca_descricao!: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })    
    item_cobranca_quantidade?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })    
    item_cobranca_valor_unitario?: number;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })    
    item_cobranca_valor_total?: number;

    @IsOptional()
    @IsDate()    
    item_cobranca_criado?: Date;

    @IsOptional()
    @IsInt()
    item_cobranca_status?: number;
}