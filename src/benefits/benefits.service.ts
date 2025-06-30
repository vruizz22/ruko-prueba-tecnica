import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { benefitsToCreate } from '@utils/types';

@Injectable()
export class BenefitsService {
  constructor(private prisma: PrismaService) {}

  /*
    Lo primero a implementar sera crear este beneficio:
    "Beneficio automático a los clientes que visiten 
    5 veces seguidas una misma tienda 
    sin haber recargado su tarjeta entre medio"
    Resumen de entidades involucradas:
    event: fuente de datos para detectar la condición.
    benefit: almacena la definición y metadatos del beneficio otorgado (por tienda).
    benefit_client: asocia el beneficio otorgado con el cliente que lo ganó.
    
    Antes de otorgar el beneficio, se verifica 
    si ya existe un beneficio igual para ese cliente y 
    tienda en el mismo periodo (para evitar duplicados).

    Detectar la secuencia de 5 visitas seguidas

    Rcorremos la lista de eventos de visita a la tienda, (1000 eventos)
    con un contador de visitas consecutivas, para cada cliente y tienda.
    Si aparece un evento de tipo: "recharge",
    reiniciamos el contador de visitas consecutivas.

    Si el contador llega a 5, creamos un nuevo beneficio en la tabla
    benefits, luego creamos una entrada en la tabla asociado a la respecitiva tienda
    benefit_client para asociar el beneficio con el cliente.
    */

  async createAutomaticBenefitForFrequentVisitors() {
    // Implementar la lógica para detectar visitas consecutivas y otorgar beneficios
    // Aquí se debe acceder a los eventos de visita y aplicar la lógica descrita
    // para identificar clientes que visitan una tienda 5 veces seguidas sin recargar.
    const events = await this.prisma.event.findMany({
      orderBy: [{ timestamp: 'asc' }],
    });

    // Agrupar los eventos por client_id para procesarlos por cliente.
    // Esto permite manejar los eventos de cada cliente de forma independiente.
    const eventsByClient: Record<string, typeof events> = {};
    for (const event of events) {
      if (!eventsByClient[event.client_id]) {
        eventsByClient[event.client_id] = [];
      }
      eventsByClient[event.client_id].push(event);
    }

    // Procesar los eventos y otorgar beneficios según la lógica definida.
    const benefitsToCreate: benefitsToCreate[] = [];

    // Recorremos los eventos agrupados por cliente
    for (const clientEvents of Object.values(eventsByClient)) {
      // Accedemos a los eventos de cada cliente agrupados por client_id
      let consecutiveVisits = 0; // Contador de visitas consecutivas por cliente
      for (const event of clientEvents) {
        // Lógica para detectar visitas consecutivas y crear beneficios
        // Si se cumplen las condiciones, agregar a benefitsToCreate
        const { client_id, store_id } = event;

        // Recorremos la lista events con un contador de visitas consecutivas
        if (event.type === 'visit') {
          consecutiveVisits++;
        } else if (event.type === 'recharge') {
          // Si hay una recarga, reiniciamos el contador de visitas consecutivas
          consecutiveVisits = 0;
        }

        if (consecutiveVisits === 5) {
          benefitsToCreate.push({
            client_id,
            store_id,
            description:
              'Beneficio automático por 5 visitas consecutivas sin recarga',
          });
          // Reiniciar el contador después de otorgar el beneficio
          consecutiveVisits = 0;
        }
      }
    }

    // Crear los beneficios en la base de datos con la función createBenefit
    for (const benefitData of benefitsToCreate) {
      await this.createBenefit(
        benefitData.store_id,
        benefitData.client_id,
        benefitData.description,
      );
    }
    // Retornar la cantidad de beneficios creados
    return (
      'Cantidad de beneficios (sin filtrar, pueden haber repetidos): ' +
      benefitsToCreate.length
    );
  }

  async createBenefit(
    store_id: string,
    client_id: string,
    description: string,
  ) {
    // Verificar si ya existe un beneficio asociado al cliente, de la respectiva tienda y descripción
    const existingBenefit = await this.prisma.benefitClient.findFirst({
      where: {
        client_id,
        benefit: {
          store_id,
          description,
        },
      },
    });

    if (!existingBenefit) {
      // Si no existe, crear un nuevo beneficio
      const benefit = await this.prisma.benefit.create({
        data: {
          store_id,
          description,
        },
      });
      // Asociar el beneficio con el cliente
      await this.prisma.benefitClient.create({
        data: {
          client_id,
          benefit_id: benefit.benefit_id,
        },
      });
    }
  }
}
