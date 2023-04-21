import { error } from "@sveltejs/kit";
import type { ZodObject, ZodRawShape } from "zod";

export const parseData  = async <T extends ZodRawShape>(payload: unknown, schema: ZodObject<T>) => {
  const parsedData = schema.safeParse(payload);

  if (!parsedData.success) {
    console.log({ error: parsedData.error })
    const errorMessages = parsedData.error.issues.map(issue => issue.message).join('. ');
    throw error(400, errorMessages);
  }

  return parsedData.data;
}

export const parseRequest = async <T extends ZodRawShape>(request: Request, schema: ZodObject<T>) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (e) {
    throw error(400, 'Invalid JSON');
  }

  return parseData(payload, schema);
}
