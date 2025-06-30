import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  // Metodo para obtener el historial de transacciones de cada cliente
  async getClientTransactionHistory() {
    /*
     * Este método obtiene el historial de transacciones de cada cliente.
     * Recorre todos los eventos y los agrupa por cliente.
     * Luego, para cada cliente, agrupa los eventos en 2 tipos: `visit` y `recharge`.
     * Para ambos grupos, se ordenan los eventos por fecha de forma ascendente.
     * Luego, se dentro de cada grupo, se agrupan los eventos en conjuntos de semanas.
     * Donde cada conjunto de semanas contiene los eventos del respectivo tipo que ocurrieron en esa semana.
     * Luego, para cada semana se obtiene el promedio de monto recargado (si es un evento de recarga)
     * y el número de visitas (si es un evento de visita).
     * Finalmente, se retorna un objeto con el historial de transacciones de cada cliente, en el formato:
     * {
     *   "client_id": "client_1",
     *   "history": [
     *     {
     *       "type": "visit",
     *       "weeks": [
     *         { "week": "2025-W25", "count": 3 },
     *         { "week": "2025-W26", "count": 5 }
     *       ]
     *     },
     *     {
     *       "type": "recharge",
     *       "weeks": [
     *         { "week": "2025-W25", "average_amount": 0 },
     *         { "week": "2025-W26", "average_amount": 1200 }
     *       ]
     *     }
     *   ]
     * }
     */

    const events = await this.prisma.event.findMany({
      orderBy: [{ timestamp: 'asc' }],
    });

    // Agrupar los eventos por client_id
    const eventsByClient: Record<string, typeof events> = {};
    for (const event of events) {
      if (!eventsByClient[event.client_id]) {
        eventsByClient[event.client_id] = [];
      }
      eventsByClient[event.client_id].push(event);
    }

    // Procesar cada cliente de forma independiente
    return Object.entries(eventsByClient).map(([clientId, clientEvents]) => {
      // Agrupar por tipo
      const visits = clientEvents.filter((e) => e.type === 'visit');
      const recharges = clientEvents.filter((e) => e.type === 'recharge');

      // Obtener el rango de semanas para ese cliente (de la semana más antigua a la más reciente)
      let minDate = clientEvents[0]?.timestamp;
      let maxDate = clientEvents[0]?.timestamp;
      for (const e of clientEvents) {
        if (e.timestamp < minDate) minDate = e.timestamp;
        if (e.timestamp > maxDate) maxDate = e.timestamp;
      }
      // Calcular todas las semanas entre minDate y maxDate
      const weeksSorted: string[] = [];
      const current = new Date(minDate);
      const end = new Date(maxDate);
      while (current <= end) {
        const weekStr = this.getWeek(current);
        if (!weeksSorted.includes(weekStr)) weeksSorted.push(weekStr);
        current.setDate(current.getDate() + 7);
      }

      // Agrupar visitas por semana
      const visitByWeek: Record<string, number> = {};
      for (const v of visits) {
        const week = this.getWeek(v.timestamp);
        visitByWeek[week] = (visitByWeek[week] || 0) + 1;
      }

      // Agrupar recargas por semana
      const rechargeByWeek: Record<string, { total: number; count: number }> =
        {};
      for (const r of recharges) {
        const week = this.getWeek(r.timestamp);
        if (!rechargeByWeek[week])
          rechargeByWeek[week] = { total: 0, count: 0 };
        rechargeByWeek[week].total += r.amount || 0;
        rechargeByWeek[week].count++;
      }

      // Construir historial de visitas
      const visitsHistory = weeksSorted.map((week) => ({
        week,
        count: visitByWeek[week] || 0,
      }));

      // Construir historial de recargas (incluyendo semanas sin recarga)
      const rechargeHistory = weeksSorted.map((week) => ({
        week,
        average_amount:
          rechargeByWeek[week] && rechargeByWeek[week].count > 0
            ? rechargeByWeek[week].total / rechargeByWeek[week].count
            : 0,
      }));

      return {
        client_id: clientId,
        history: [
          { type: 'visit', weeks: visitsHistory },
          { type: 'recharge', weeks: rechargeHistory },
        ],
      };
    });
  }

  private getWeek(timestamp: Date): string {
    const year = timestamp.getFullYear();
    const week = this.getWeekNumber(timestamp);
    return `${year}-W${week}`;
  }

  private getWeekNumber(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1); // Primer día del año
    const diff = date.getTime() - start.getTime(); // Diferencia en milisegundos
    const oneWeek = 1000 * 60 * 60 * 24 * 7; // Una semana en milisegundos
    // Calcular el número de semanas transcurridas desde el inicio del año
    return Math.ceil((diff / oneWeek + 1) / 7);
  }
}
