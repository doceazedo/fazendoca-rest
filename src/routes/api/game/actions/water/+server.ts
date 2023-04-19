import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { getPlotWithCrop, giveXP, parseRequest } from '$lib/utils';
import { EMPTY_UUID } from '$lib/helpers';

const RequestData = z.object({
  plotId: z.number().int().positive(),
});

const WATER_DURATION = 1000;
const WATER_REDUCE_MS = 2500;

const XP = 20;

export const POST = async ({ request }) => {
  const data = await parseRequest(request, RequestData);
  const plot = await getPlotWithCrop(data.plotId);
  if (plot.crop.wateredUntil && plot.crop.wateredUntil > new Date()) throw error(400, 'crop is already watered');

  const wateredCrop = await prisma.crop.update({
    where: {
      id: plot.crop.id
    },
    data: {
      wateredUntil: new Date(Date.now() + WATER_DURATION),
      readyAt: new Date(plot.crop.readyAt.setMilliseconds(plot.crop.readyAt.getMilliseconds() - WATER_REDUCE_MS))
    }
  });
  if (!wateredCrop) throw error(500, 'crop not updated');
  
  giveXP(EMPTY_UUID, XP);

  return json({ crop: wateredCrop });
}
