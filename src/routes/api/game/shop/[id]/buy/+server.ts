import { z } from 'zod';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/db';
import { EMPTY_UUID } from '$lib/helpers';
import { giveItems, parseRequest, validateShopItem } from '$lib/utils';

const RequestData = z.object({
  shopItem: z.number().int().positive(),
  quantity: z.number().int().positive(),
  currency: z.enum(['REGULAR', 'PREMIUM']),
});

export const POST = async ({ request }) => {
  const data = await parseRequest(request, RequestData);

  const player = await prisma.user.findUnique({
    where: {
      id: EMPTY_UUID
    }
  });
  if (!player) throw error(404, 'player not found');

  const shopItem = await prisma.shopItems.findUnique({
    where: {
      id: data.shopItem
    }
  });
  if (!shopItem) throw error(404, 'shop item not found');

  // TODO: data.quantity > shopItem.quantity (opt) and subtract

  const isValidItem = await validateShopItem(shopItem.itemId, shopItem.type);
  if (!isValidItem) throw error(500, 'item data not found');

  const farm = await prisma.farm.findUnique({
    where: {
      id: EMPTY_UUID
    }
  });
  if (!farm) throw error(404, 'farm not found');
  if (farm.ownerId !== EMPTY_UUID) throw error(401, 'not your farm');

  let playerWasCharged = false;
  if (data.currency == 'REGULAR') {
    playerWasCharged = await chargePlayer(
      player.id,
      player.balRegular,
      data.quantity,
      shopItem.priceRegular,
      false
    );
  } else if (data.currency == 'PREMIUM') {
    playerWasCharged = await chargePlayer(
      player.id,
      player.balRegular,
      data.quantity,
      shopItem.pricePremium,
      true
    );
  }
  if (!playerWasCharged) throw error(500, 'could not charge player');

  const farmItem = await giveItems({
    itemId: shopItem.itemId,
    quantity: data.quantity,
    type: shopItem.type,
    farmId: farm.id
  });
  if (!farmItem) throw error(500, 'item was not given');

  return json({ farmItem });
}

const chargePlayer = async (
  playerId: string,
  balance: number,
  quantity: number,
  price: number | null,
  isPremium: boolean,
) => {
  if (!price) throw error(400, 'cannot buy item with this currency');
  if (balance < price * quantity) throw error(400, 'not enough money');

  const updatedBalance = balance - price
  const updatedPlayer = prisma.user.update({
    where: {
      id: playerId
    },
    data: {
      balRegular: isPremium ? undefined : updatedBalance,
      balPremium: isPremium ? updatedBalance : undefined,
    }
  });
  if (!updatedPlayer) throw error(500, 'could not update player balance');

  return true;
}