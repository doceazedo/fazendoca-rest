import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';

export const GET = async () => {
  // TODO: select only system shops
  const shops = await prisma.shop.findMany({
    where: {
      farmId: null
    },
    select: {
      id: true
    }
  });
  const shopIDs = shops.map(shop => shop.id);
  return json({ shops: shopIDs });
}
