import { Module } from '@nestjs/common';
import { ChargeService } from './charge.service';
import { ChargeController } from './charge.controller';

@Module({
  providers: [ChargeService],
  controllers: [ChargeController]
})
export class ChargeModule {}
