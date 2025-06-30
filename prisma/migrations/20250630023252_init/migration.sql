-- CreateTable
CREATE TABLE "Client" (
    "client_id" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "Store" (
    "store_id" VARCHAR NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("store_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "amount" INTEGER,
    "timestamp" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "Benefit" (
    "benefit_id" SERIAL NOT NULL,
    "client_id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "description" TEXT,
    "granted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Benefit_pkey" PRIMARY KEY ("benefit_id")
);

-- CreateTable
CREATE TABLE "BenefitClient" (
    "benefit_id" INTEGER NOT NULL,
    "client_id" TEXT NOT NULL,

    CONSTRAINT "BenefitClient_pkey" PRIMARY KEY ("client_id","benefit_id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Benefit" ADD CONSTRAINT "Benefit_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenefitClient" ADD CONSTRAINT "BenefitClient_benefit_id_fkey" FOREIGN KEY ("benefit_id") REFERENCES "Benefit"("benefit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenefitClient" ADD CONSTRAINT "BenefitClient_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;
