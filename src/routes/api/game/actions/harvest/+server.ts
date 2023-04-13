import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';
import { giveItems, parseRequest } from '$lib/utils';

const RequestData = z.object({
  plotId: z.number().int().positive(),
});

export const POST = async ({ request }) => {
  const data = await parseRequest(request, RequestData);

  const plot = await prisma.plot.findUnique({
    where: {
      id: data.plotId
    },
    include: {
      farm: true,
      crop: true
    }
  });
  if (!plot) throw error(404, 'plot not found');
  if (plot.farm.ownerId !== EMPTY_UUID) throw error(401, 'not your farm');
  if (!plot.crop) throw error(400, 'cannot harvest empty plot');
  if (plot.crop.readyAt > new Date()) throw error(400, 'crop is not ready');

  const seed = await prisma.seed.findUnique({
    where: {
      id: plot.crop.seedId
    },
    include: {
      plant: true
    }
  });
  if (!seed) throw error(500, 'seed data not found');

  await prisma.crop.delete({
    where: {
      id: plot.crop.id
    }
  });

  const farmItem = await giveItems({
    itemId: seed.plant.id,
    quantity: seed.lootQuantity,
    type: 'PLANT',
    farmId: plot.farmId
  });
  if (!farmItem) throw error(500, 'loot was not given');

  return json({ farmItem });
}
