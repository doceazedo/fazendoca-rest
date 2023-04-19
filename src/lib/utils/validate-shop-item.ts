import { prisma } from "$lib/db";
import type { ItemType } from "@prisma/client";

export const validateShopItem = async (id: string, type: ItemType) => {
  const where = {
    where: {
      id
    }
  };

  switch (type) {
    case 'SEED':
      return !!prisma.seed.findUnique(where);
    case 'PLANT':
      return !!prisma.plant.findUnique(where);
    default:
      return false;
  }
}