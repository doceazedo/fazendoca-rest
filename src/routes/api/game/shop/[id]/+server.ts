import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { parseData } from '$lib/utils';

const RequestParams = z.object({
  id: z.string(),
});

export const GET = async ({ params }) => {
  const { id } = await parseData(params, RequestParams);

  const shop = await prisma.shop.findUnique({
    where: {
      id
    },
    include: {
      items: true
    }
  });
  if (!shop) throw error(404, 'shop not found');

  return json({ shop });
}
