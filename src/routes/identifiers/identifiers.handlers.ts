import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import { identifier_status, identifiers } from "@/db/postgres/schemas/identifiers/schema";
import { AllIdentifiersRoute, CreateIdentifierRoute, CreateIdentifierStatusRoute, GetIdentifierRoute, GetIdentifierStatusRoute, PatchIdentifierRoute } from "./identifiers.routes";

export const allIdentifiers: AppRouteHandler<AllIdentifiersRoute> = async (c) => {
  const allIdentifiers = await postgres.select().from(identifiers);
  return c.json(allIdentifiers);
};

export const createIdentifier: AppRouteHandler<CreateIdentifierRoute> = async (c) => {
  const { identifier, status } = c.req.valid("json");
  const [insertedIdentifier] = await postgres.insert(identifiers).values(identifier).returning();
  // FIX: El device_id deberia ser opcional cuando se crea el device
  status.identifier_id = insertedIdentifier.id;
  const [insertedStatus] = await postgres.insert(identifier_status).values(status).returning();
  const inserted = { identifier: insertedIdentifier, status: insertedStatus };
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getIdentifier: AppRouteHandler<GetIdentifierRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedIdentifier] = await postgres.select().from(identifiers).where(eq(identifiers.identifier_id, slug));

  if (!selectedIdentifier) {
    return c.json(
      {
        message: "Identifier not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedIdentifier, HttpStatusCodes.OK);
};

export const patchIdentifier: AppRouteHandler<PatchIdentifierRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [updatedIdentifier] = await postgres.update(identifiers).set(updates).where(eq(identifiers.id, id)).returning();

  if (!updatedIdentifier) {
    return c.json(
      {
        message: "Identifier not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedIdentifier, HttpStatusCodes.OK);
};

export const createIdentifierStatus: AppRouteHandler<CreateIdentifierStatusRoute> = async (c) => {
  const newIdentifierStatus = c.req.valid("json");
  const [inserted] = await postgres.insert(identifier_status).values(newIdentifierStatus).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getIdentifierStatus: AppRouteHandler<GetIdentifierStatusRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedIdentifier] = await postgres.select().from(identifiers).where(eq(identifiers.identifier_id, slug));

  const [selectedIdentifierStatus] = await postgres.select().from(identifier_status).where(eq(identifier_status.identifier_id, selectedIdentifier.id)).orderBy(desc(identifier_status.id)).limit(1);

  if (!selectedIdentifierStatus) {
    return c.json(
      {
        message: "Identifier Status not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedIdentifierStatus, HttpStatusCodes.OK);
};
