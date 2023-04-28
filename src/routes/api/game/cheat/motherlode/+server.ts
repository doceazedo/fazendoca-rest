import { json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';

export const GET = async () => {
  const player = await prisma.user.findUnique({
    where: {
      id: EMPTY_UUID
    }
  });
  const updatedPlayer = await prisma.user.update({
    where: {
      id: player.id
    },
    data: {
      balRegular: player.balRegular + 5000
    }
  });
  return json({ player: updatedPlayer });
}
