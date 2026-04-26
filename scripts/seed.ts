import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.horse.deleteMany();

  await prisma.horse.createMany({
    data: [
      {
        name: "NANA",
        rider: "RITA RODRIGUES",
        box: "265",
        class: "INF2",
        startTime: "10:00",
      },
    ],
  });

  console.log("Dados importados com sucesso.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());