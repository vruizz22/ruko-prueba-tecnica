import { Module } from '@nestjs/common';
import { BenefitsController } from '@benefits/benefits.controller';
import { BenefitsService } from '@benefits/benefits.service';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [BenefitsController],
  providers: [BenefitsService, PrismaService],
})
export class BenefitsModule {}
