import type { ContentBlock } from "@prisma/client";
import { prisma } from "./prismaClient";
import { JSONScalar } from "./utils/jsonScalar";
import { getDefaultPayload, type BlockKey } from "./utils/defaults";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const deepMerge = (
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> => {
  const result = deepClone(target);

  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key] as Record<string, unknown>, value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

const ensureBlock = async (key: BlockKey): Promise<ContentBlock> => {
  return prisma.contentBlock.upsert({
    where: { key },
    create: { key, payload: getDefaultPayload(key) },
    update: {},
  });
};

const normalizePayload = (key: BlockKey, payload: unknown) => {
  const base = getDefaultPayload(key) as Record<string, unknown>;
  const source = isPlainObject(payload) ? payload : {};
  return deepMerge(base, source);
};

const toResponse = (key: BlockKey, block: ContentBlock) => {
  const payload = normalizePayload(key, block.payload);
  return { id: block.id, ...payload };
};

const createQueryResolver = (key: BlockKey) => async () => {
  const block = await ensureBlock(key);
  return [toResponse(key, block)];
};

const createMutationResolver = (key: BlockKey) => async (
  _: unknown,
  { input }: { input?: Record<string, unknown> | null }
) => {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid input payload");
  }

  const block = await ensureBlock(key);
  const existingPayload = normalizePayload(key, block.payload);
  const nextPayload = deepMerge(existingPayload, input as Record<string, unknown>);

  const updated = await prisma.contentBlock.update({
    where: { id: block.id },
    data: { payload: nextPayload },
  });

  return toResponse(key, updated);
};

const Query = {
  homePage: createQueryResolver("homePage"),
  logo: createQueryResolver("logo"),
  color: createQueryResolver("color"),
};

const Mutation = {
  updateHomePage: createMutationResolver("homePage"),
  updateLogo: createMutationResolver("logo"),
  updateColor: createMutationResolver("color"),
};

const resolvers = {
  JSON: JSONScalar,
  Query,
  Mutation,
};

export default resolvers;
