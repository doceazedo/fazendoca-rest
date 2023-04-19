import { prisma } from "$lib/db";
import { error } from "@sveltejs/kit";

const baseXP = 500;
const incrementFactor = 1.2;

export const getLevel = (xp: number) => {
  let level = 1;
  let xpRequired = baseXP;

  while (xp >= xpRequired) {
    xp -= xpRequired;
    level++;
    xpRequired = Math.round(xpRequired * incrementFactor);
  }

  return level;
}

export const giveXP = async (userID: string, xp: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userID,
    }
  });
  if (!user) return false;

  // TODO: vip members have a higher modifier
  const xpModifier = 1;
  const updatedXP = user.xp + (xp * xpModifier);

  const updatedUser = prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      xp: updatedXP
    }
  });
  if (!updatedUser) return false;

  return true;
}