import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const article = await db.article.findFirst({
    where: {
      title: {
        contains: "प्रधानमंत्री ने कारगिल विजय"
      }
    }
  });
  console.log("Article:", article);
}

main().catch(console.error).finally(() => db.$disconnect());
