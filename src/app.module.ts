import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation.js';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { PaymentModule } from './payment/payment.module';
import { ChargeModule } from './charge/charge.module';
import { ChargeItensModule } from './charge_itens/charge_itens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    PaymentModule,
    ChargeModule,
    ChargeItensModule,
  ],
})
export class AppModule { }