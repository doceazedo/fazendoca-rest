import { prisma } from '$lib/db';
import type { FarmItem } from '@prisma/client';

export const removeItems = async (item: FarmItem, quantity: number) => {
  if (item.quantity <= quantity) {
    const deletedItem = await prisma.farmItem.delete({
      where: {
        id: item.id
      }
    });
    return { ...deletedItem, quantity: 0 }
  } else {
    return await prisma.farmItem.update({
      where: {
        id: item.id
      },
      data: {
        quantity: item.quantity - quantity
      }
    });
  }
}
