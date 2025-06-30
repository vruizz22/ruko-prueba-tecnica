import { Controller, Get } from '@nestjs/common';
import { ClientsService } from '@clients/clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get('/transaction-history')
  async getClientTransactionHistory() {
    return await this.clientsService.getClientTransactionHistory();
  }
}
