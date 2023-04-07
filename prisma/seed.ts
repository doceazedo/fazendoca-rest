import { PrismaClient } from '@prisma/client';
import { DEFAULT_ID, EMPTY_UUID, RADISH_SLUG } from '../src/lib/helpers';

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

  const plant = await prisma.seed.upsert({
    where: { id: RADISH_SLUG },
    update: {},
    create: {
      id: RADISH_SLUG,
      growthTime: 10000
    }
  });

  const inventoryRadishes = await prisma.farmItem.upsert({
    where: { id: DEFAULT_ID },
    update: {},
    create: {
      id: DEFAULT_ID,
      itemId: RADISH_SLUG,
      type: 'SEED',
      quantity: 64,
      farmId: farm.id
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
