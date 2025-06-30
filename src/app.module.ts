import { Module } from '@nestjs/common';
import { ClientsModule } from '@clients/clients.module';
import { BenefitsModule } from '@benefits/benefits.module';

@Module({
  imports: [ClientsModule, BenefitsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
