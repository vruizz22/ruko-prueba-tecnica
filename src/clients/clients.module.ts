import { Module } from '@nestjs/common';
import { ClientsController } from '@clients/clients.controller';
import { ClientsService } from '@clients/clients.service';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService],
})
export class ClientsModule {}
