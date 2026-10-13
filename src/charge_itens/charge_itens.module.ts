import { Module } from '@nestjs/common';
import { ChargeItensService } from './charge_itens.service';
import { ChargeItensController } from './charge_itens.controller';

@Module({
  providers: [ChargeItensService],
  controllers: [ChargeItensController]
})
export class ChargeItensModule {}
