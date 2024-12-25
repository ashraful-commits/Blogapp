import { PrismaClient } from "@prisma/client";
import { links } from "../data/links";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "test",
      email: "test@gmail.com",
      role: "ADMIN",
      image: "https://example.com/default-image.jpg",
    },
  });

  // await prisma.link.createMany({
  //   data: links,
  // });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
