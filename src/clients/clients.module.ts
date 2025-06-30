import { Module } from '@nestjs/common';
import { ClientsController } from '@clients/clients.controller';

@Module({
  controllers: [ClientsController],
})
export class ClientsModule {}
