import { Module } from '@nestjs/common';
import { BenefitsController } from '@benefits/benefits.controller';

@Module({
  controllers: [BenefitsController],
})
export class BenefitsModule {}
