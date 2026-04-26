import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // criar evento
  const event = await prisma.event.create({
    data: {
      name: "Sunshine Tour",
      location: "Vejer de la Frontera",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // criar pessoa
  const person = await prisma.person.create({
    data: {
      name: "Miguel Costa Dias",
      category: "STAFF",
      eventId: event.id,
    },
  });

  // criar acessos
  await prisma.access.createMany({
    data: [
      { zone: "VIP", personId: person.id },
      { zone: "STABLES", personId: person.id },
    ],
  });

  console.log("Dados inseridos com sucesso.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());