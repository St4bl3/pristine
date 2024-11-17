// prisma/seed.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = ["men", "women", "children"];
  for (const category of categories) {
    for (let i = 1; i <= 5; i++) {
      await prisma.product.create({
        data: {
          name: `${category} product ${i}`,
          category,
          image: "https://via.placeholder.com/150",
          description: `Description for ${category} product ${i}`,
          startingPrice: 50.0,
          currentBid: 50.0,
          auctionEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          status: "Active",
        },
      });
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
