import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';

export const GET = async () => {
  // TODO: select only system shops
  const shops = await prisma.shop.findMany({
    where: {
      farmId: null
    }
  });
  return json({ shops });
}
