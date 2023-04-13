import { error } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';
import type { Crop, Farm, Plot } from '@prisma/client';

type PlotData = Plot & {
  farm: Farm;
  crop: Crop;
};

export const getPlotWithCrop = async (id: number) => {
  const plot = await prisma.plot.findUnique({
    where: {
      id
    },
    include: {
      farm: true,
      crop: true
    }
  });
  if (!plot) throw error(404, 'plot not found');
  if (plot.farm.ownerId !== EMPTY_UUID) throw error(401, 'not your farm');
  if (!plot.crop) throw error(400, 'plot is empty');
  return plot as PlotData;
}
