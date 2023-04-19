import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { getPlotWithCrop, giveItems, giveXP, parseRequest } from '$lib/utils';
import { EMPTY_UUID } from '$lib/helpers';

const RequestData = z.object({
  plotId: z.number().int().positive(),
});

const XP = 100;

export const POST = async ({ request }) => {
  const data = await parseRequest(request, RequestData);
  
  const plot = await getPlotWithCrop(data.plotId);
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

  giveXP(EMPTY_UUID, XP);

  return json({ farmItem });
}
