import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const articles = await db.article.findMany({
    where: {
      body: {
        contains: "अग्रवाल"
      }
    },
    take: 5
  });
  console.log("Articles with Agarwal count:", articles.length);
  for (const article of articles) {
    console.log("Article:", {
      slug: article.slug,
      authorId: article.authorId,
      title: article.title
    });
  }
}

main().catch(console.error).finally(() => db.$disconnect());
