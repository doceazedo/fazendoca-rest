import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';

type RequestData = {
  x: number;
  y: number;
}

export const POST = async ({ request }) => {
  const data = await request.json() as RequestData;

  // TODO: zod
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