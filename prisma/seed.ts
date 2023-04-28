import { PrismaClient } from '@prisma/client';
import { DEFAULT_SHOP_ID, EMPTY_UUID, RADISH_SEED_SLUG, RADISH_SLUG } from '../src/lib/helpers';

const prisma = new PrismaClient();

const main = async () => {
  const user = await prisma.user.upsert({
    where: { id: EMPTY_UUID },
    update: {},
    create: {
      id: EMPTY_UUID,
      name: 'DoceAzedo',
      balRegular: 1000,
      balPremium: 200
    }
  });

  const farm = await prisma.farm.upsert({
    where: { id: EMPTY_UUID },
    update: {},
    create: {
      id: EMPTY_UUID,
      ownerId: user.id
    }
  });

  const seed = await prisma.seed.upsert({
    where: { id: RADISH_SEED_SLUG },
    update: {},
    create: {
      id: RADISH_SEED_SLUG,
      lootQuantity: 4,
      growthTime: 10000,
      plant: {
        create: {
          id: RADISH_SLUG,
          sellPrice: 40
        }
      }
    }
  });

  const exisitingRadishInInventory = await prisma.farmItem.findFirst({
    where: {
      itemId: RADISH_SEED_SLUG,
      farmId: farm.id
    }
  })

  if (!exisitingRadishInInventory) await prisma.farmItem.create({
    data: {
      itemId: RADISH_SEED_SLUG,
      type: 'SEED',
      quantity: 64,
      farmId: farm.id
    }
  });

  await prisma.shop.upsert({
    where: {
      id: 'GARDENING_SHOP'
    },
    update: {},
    create: {
      id: 'GARDENING_SHOP',
      categories: ['SEED', 'PRODUCT', 'TOOL'],
      items: {
        create: {
          itemId: RADISH_SEED_SLUG,
          type: 'SEED',
          priceRegular: 100,
          pricePremium: 20,
        }
      }
    }
  });
}

try {
  await main();
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}

await prisma.$disconnect()
