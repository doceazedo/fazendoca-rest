import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';

export const GET = async () => {
  const items = await prisma.farmItem.findMany({
    where: {
      farmId: EMPTY_UUID
    }
  });
  return json({ items });
}
