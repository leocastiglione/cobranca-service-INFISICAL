import { PartialType } from "@nestjs/mapped-types";
import { CreateChargeItemDto } from "./create-charge_itens.dto";


export class UpdateChargeItemDto extends PartialType( CreateChargeItemDto) {}