import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';

export const GET = async () => {
  const farm = await prisma.farm.findUnique({
    where: {
      id: EMPTY_UUID
    },
    include: {
      plots: {
        select: {
          id: true,
          x: true,
          y: true,
          crop: true
        }
      }
    }
  });
  return json({ farm });
}
