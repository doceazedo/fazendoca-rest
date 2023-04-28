import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';

export const GET = async () => {
  const player = await prisma.user.findUnique({
    where: {
      id: EMPTY_UUID
    }
  });
  return json({ player });
}
