import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';
import { parseRequest } from '$lib/utils';

const PlowRequestData = z.object({
  x: z.number().int().gte(0),
  y: z.number().int().gte(0),
});

export const POST = async ({ request }) => {
  const data = await parseRequest(request, PlowRequestData);
  
  // TODO: verify if location is valid / inside grid

  const occupiedPlot = await prisma.plot.findFirst({
    where: {
      x: data.x,
      y: data.y
    }
  });
  if (occupiedPlot) throw error(400, 'this plot is not empty');

  const createdPlot = await prisma.plot.create({
    data: {
      x: data.x,
      y: data.y,
      farmId: EMPTY_UUID
    }
  });
  if (!createdPlot) throw error(500, 'plot not created');
  
  const { farmId, ...plot } = createdPlot;

  return json({ plot });
}

const BreakRequestData = z.object({
  plotId: z.number().int().positive()
});

export const DELETE = async ({ request }) => {
  const data = await parseRequest(request, BreakRequestData);

  const deletedPlot = await prisma.plot.delete({
    where: {
      id: data.plotId
    }
  });
  if (!deletedPlot) throw error(500, 'could not break plot');

  return json({ plot: deletedPlot });
}
