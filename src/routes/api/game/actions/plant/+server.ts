import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID, STAGES } from '$lib/helpers';

type RequestData = {
  plotId: number;
  farmItem: number;
}

export const POST = async ({ request }) => {
  const data = await request.json() as RequestData;

  // TODO: zod

  const plot = await prisma.plot.findUnique({
    where: {
      id: data.plotId
    },
    include: {
      crop: true
    }
  });
  if (!plot) throw error(404, 'plot not found');
  if (plot.crop) throw error(400, 'plot already has crop');

  const farmItem = await prisma.farmItem.findUnique({
    where: {
      id: data.farmItem
    }
  });
  if (!farmItem) throw error(404, 'farm item not found');
  if (farmItem.farmId !== EMPTY_UUID) throw error(401, 'not your item');
  if (farmItem.type !== 'SEED') throw error(400, 'not a seed');
  if (farmItem.quantity < 1) throw error(400, 'not enough items');

  const seed = await prisma.seed.findUnique({
    where: {
      id: farmItem.itemId
    }
  });
  if (!seed) throw error(404, 'seed not found');

  const crop = await prisma.crop.create({
    data: {
      seedId: seed.id,
      nextStageAt: new Date(Date.now() + (seed.growthTime / STAGES)),
      plotId: plot.id
    }
  });
  if (!crop) throw error(500, 'crop not created');

  if (farmItem.quantity <= 1) {
    await prisma.farmItem.delete({
      where: {
        id: farmItem.id
      }
    });
  } else {
    await prisma.farmItem.update({
      where: {
        id: farmItem.id
      },
      data: {
        quantity: farmItem.quantity - 1
      }
    });
  }

  return json({ crop });
}