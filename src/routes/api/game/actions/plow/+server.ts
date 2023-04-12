import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';
import { parseRequest } from '$lib/utils';

const RequestData = z.object({
  x: z.number().int().gte(0),
  y: z.number().int().gte(0),
});

export const POST = async ({ request }) => {
  const data = await parseRequest(request, RequestData);
  
  // TODO: verify if location is valid / inside grid

  const occupiedPlot = await prisma.plot.findFirst({
    where: {
      x: data.x,
      y: data.y
    }
  });
  if (occupiedPlot) throw error(400, 'this plot is not empty');

  const plot = await prisma.plot.create({
    data: {
      x: data.x,
      y: data.y,
      farmId: EMPTY_UUID
    }
  });
  if (!plot) throw error(500, 'plot not created');

  return json({ plot });
}