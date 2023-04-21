import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';
import { parseRequest, removeItems } from '$lib/utils';
import type { FarmItem } from '@prisma/client';

const MAX_SELLING_ITEMS = 32;

const RequestData = z.object({
  items: z.object({
    id: z.number().int().positive(),
    quantity: z.number().int().positive(),
  }).array()
});

export const POST = async ({ request }) => {
  const data = await parseRequest(request, RequestData);
  if (data.items.length > MAX_SELLING_ITEMS) throw error(400, 'too many items');

  const player = await prisma.user.findUnique({
    where: {
      id: EMPTY_UUID
    }
  });
  if (!player) throw error(500, 'default user not found');

  const farmItems = await prisma.farmItem.findMany({
    where: {
      farmId: EMPTY_UUID,
      OR: data.items.map(item => ({ id: item.id }))
    }
  });
  if (farmItems.length !== data.items.length) throw error(400, 'could not find all items or found too many');
  if (!farmItems.every(item => item.type === 'PLANT')) throw error(400, 'cannot sell items other than plants');

  const plants = await prisma.plant.findMany({
    where: {
      OR: farmItems.map(item => ({ id: item.itemId }))
    }
  });
  if (plants.length !== data.items.length) throw error(400, 'could not find all plants or found too many');

  const findFarmItem = (id: number) => {
    const item = farmItems.find(farmItem => farmItem.id === id);
    if (!item) throw error(404, `could not find item "${id}"`);
    return item;
  };

  data.items.map(item => {
    const farmItem = findFarmItem(item.id);
    if (item.quantity > farmItem.quantity) throw error(400, `not enough ${farmItem.itemId} in inventory`);
  });

  const soldItems: FarmItem[] = [];
  let profit = 0;

  for (const item of data.items) {
    const farmItem = findFarmItem(item.id);
    const plant = plants.find(plant => plant.id === farmItem.itemId);
    if (!plant) throw error(500, `could not find plant "${farmItem.itemId}"`);

    const removedItem = await removeItems(farmItem, item.quantity);
    if (!removedItem) throw error(500, `could not remove item "${item.id}"`);
    soldItems.push(removedItem);

    profit += plant.sellPrice * item.quantity;
  }

  const updatedPlayer = await prisma.user.update({
    where: {
      id: player.id
    },
    data: {
      balRegular: player.balRegular + profit
    }
  });
  if (!updatedPlayer) throw error(500, 'could not update player\'s balance');

  return json({ updatedBalance: updatedPlayer.balRegular, soldItems });
}