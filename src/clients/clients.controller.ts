import { Controller, Get } from '@nestjs/common';

@Controller('clients')
export class ClientsController {
  @Get('/')
  getAllClients() {
    return 'This action returns all clients';
  }
}
