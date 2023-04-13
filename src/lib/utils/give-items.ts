import { prisma } from '$lib/db';
import type { FarmItem } from '@prisma/client';

export const giveItems = async (data: Omit<FarmItem, 'id'>) => {
  // TODO: check inventory capacity
 
  const existingFarmItem = await prisma.farmItem.findFirst({
    where: {
      itemId: data.itemId,
      type: data.type,
      farmId: data.farmId
    }
  });
  if (existingFarmItem) {
    return await prisma.farmItem.update({
      where: {
        id: existingFarmItem.id
      },
      data: {
        quantity: existingFarmItem.quantity + data.quantity
      }
    });
  }
  
  return await prisma.farmItem.create({
    data
  });
}