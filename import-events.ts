import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';

interface EventData {
  client_id: string;
  store_id: string;
  type: 'visit' | 'recharge';
  amount?: number;
  timestamp: string;
}

const prisma: PrismaClient = new PrismaClient();

async function main() {
  const data = JSON.parse(
    await fs.readFile('ruklo_events_1000.json', 'utf-8'),
  ) as EventData[];

  for (const event of data) {
    // Validar que existan los campos requeridos
    if (!event.client_id || !event.store_id || !event.type || !event.timestamp)
      continue;

    // Crear cliente si no existe
    await prisma.client.upsert({
      where: { client_id: event.client_id },
      update: {},
      create: { client_id: event.client_id },
    });

    // Crear tienda si no existe
    await prisma.store.upsert({
      where: { store_id: event.store_id },
      update: {},
      create: { store_id: event.store_id },
    });

    // Insertar evento
    await prisma.event.create({
      data: {
        client_id: event.client_id,
        store_id: event.store_id,
        type: event.type,
        amount: event.type === 'recharge' ? event.amount : null,
        timestamp: new Date(event.timestamp),
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
