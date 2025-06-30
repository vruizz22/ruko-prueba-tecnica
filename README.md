# Prueba Técnica Ruko

## Propuesta de stack y arquitectura

Para abordar esta prueba técnica, he decidido utilizar un stack alineado con el entorno tecnológico de la empresa y que me permita escalar la solución fácilmente en un entorno real:

- **Frontend:** Next.js (aunque no es requerido para la prueba, lo considero para una posible extensión futura y alineación con el stack de la empresa).
- **Backend:** Nest.js (TypeScript), por su estructura modular, escalabilidad y soporte para buenas prácticas.
- **Base de datos:** PostgreSQL. Ideal para modelar relaciones y escalar, aunque para la prueba simularé los datos en memoria.
- **ORM:** Prisma, por su integración con TypeScript y PostgreSQL, y facilidad de uso y migración.
- **Infraestructura:** AWS (pensando en escalabilidad futura, aunque para la prueba se ejecuta localmente).
- **Testing:** Jest (integrado en Nest.js).
- **Linting y formato:** ESLint + Prettier.

---

## 🧩 Resolución de la prueba

### 🧠 Parte 1

#### 1. Beneficio por visitas seguidas

#### 2. Historial de transacciones agrupado

---

### ✍️ Parte 2

#### Limitaciones de la solución actual

#### Escalabilidad con 100.000 eventos diarios

---

## ✅ Requisitos técnicos

## 📚 Decisiones y notas técnicas

He optado por un modelo relacional simple y eficiente para la prueba:

- **clients y stores**: Identifican a los actores principales.
- **events**: Almacena cada acción (visita o recarga) con su tipo, monto y timestamp, permitiendo consultas eficientes para ambos requerimientos.
- **benefits**: Registra los beneficios otorgados, vinculados a cliente y tienda, con descripción y fecha.

Las relaciones permiten consultar fácilmente el historial de eventos y los beneficios por cliente y tienda.
Este modelo es flexible, escalable y fácil de consultar para los dos objetivos principales de la prueba. Además, permite futuras extensiones (más tipos de eventos, más atributos en beneficios, etc.)

El E/R en DBML:

```SQL
Project ruklo {
  database_type: 'PostgreSQL'
  Note: 'Modelo de datos para la aplicación de fidelización Ruklo'
}

// Tabla de Clientes
Table clients {
  client_id   varchar   [pk, not null]
  created_at  timestamptz [not null, default: `now()`]
}

// Tabla de Tiendas
Table stores {
  store_id    varchar   [pk, not null]
  name        varchar
  created_at  timestamptz [not null, default: `now()`]
}

// Tabla de Eventos (visitas y recargas)
Table events {
  event_id    serial     [pk, not null, increment]
  client_id   varchar    [not null]
  store_id    varchar    [not null]
  type        varchar(10) [not null] // 'visit' o 'recharge'
  amount      int        // solo para 'recharge'
  timestamp   timestamptz [not null]
}

// Tabla de Beneficios otorgados
Table benefits {
  benefit_id  serial     [pk, not null, increment]
  client_id   varchar    [not null]
  store_id    varchar    [not null]
  description varchar
  granted_at  timestamptz [not null, default: `now()`]
}

// Relaciones
Ref: events.client_id > clients.client_id // muchos eventos pertenecen a un cliente
Ref: events.store_id > stores.store_id // muchos eventos pertenecen a una tienda
Ref: benefits.client_id > clients.client_id // muchos beneficios pertenecen a un cliente
Ref: benefits.store_id > stores.store_id // muchos beneficios pertenecen a una tienda
```
