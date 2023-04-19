import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';
import { giveXP, parseRequest } from '$lib/utils';

const RequestData = z.object({
  plotId: z.number().int().positive(),
  farmItem: z.number().int().positive(),
});

const XP = 50;

export const POST = async ({ request }) => {
  const data = await parseRequest(request, RequestData);

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
  if (!seed) throw error(500, 'seed data not found');

  const crop = await prisma.crop.create({
    data: {
      seedId: seed.id,
      readyAt: new Date(Date.now() + seed.growthTime),
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

  giveXP(EMPTY_UUID, XP);
  
  return json({ crop });
}