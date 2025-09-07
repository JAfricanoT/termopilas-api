import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { temporary_identifier_bearer_status, temporary_identifier_bearers, temporary_identifiers } from "@/db/postgres/schemas/identifiers/temporary/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { AllTemporaryIdentifierBearersRoute, AllTemporaryIdentifiersRoute, CreateTemporaryIdentifierBearerRoute, CreateTemporaryIdentifierBearerStatusRoute, CreateTemporaryIdentifierRoute, GetTemporaryIdentifierBearerRoute, GetTemporaryIdentifierBearerStatusRoute, GetTemporaryIdentifierRoute, PatchTemporaryIdentifierBearerRoute, PatchTemporaryIdentifierRoute } from "./temporary.routes";

export const allTemporaryIdentifiers: AppRouteHandler<AllTemporaryIdentifiersRoute> = async (c) => {
  const allTemporaryIdentifiers = await postgres
    .select()
    .from(temporary_identifiers);
  return c.json(allTemporaryIdentifiers);
};

export const createTemporaryIdentifier: AppRouteHandler<CreateTemporaryIdentifierRoute> = async (c) => {
  const temporaryIdentifier = c.req.valid("json");
  const [insertedTemporaryIdentifier] = await postgres
    .insert(temporary_identifiers)
    .values(temporaryIdentifier)
    .returning();
  return c.json(insertedTemporaryIdentifier, HttpStatusCodes.OK);
};

export const getTemporaryIdentifier: AppRouteHandler<GetTemporaryIdentifierRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedTemporaryIdentifier] = await postgres
    .select()
    .from(temporary_identifiers)
    .where(eq(temporary_identifiers.factory_id, slug));

  if (!selectedTemporaryIdentifier) {
    return c.json(
      {
        message: "Temporary Identifier not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedTemporaryIdentifier, HttpStatusCodes.OK);
};

export const patchTemporaryIdentifier: AppRouteHandler<PatchTemporaryIdentifierRoute> = async (c) => {
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

  const [updatedTemporaryIdentifier] = await postgres
    .update(temporary_identifiers)
    .set(updates)
    .where(eq(temporary_identifiers.id, id))
    .returning();

  if (!updatedTemporaryIdentifier) {
    return c.json(
      {
        message: "Temporary Identifier not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedTemporaryIdentifier, HttpStatusCodes.OK);
};

export const allTemporaryIdentifierBearers: AppRouteHandler<AllTemporaryIdentifierBearersRoute> = async (c) => {
  const allTemporaryIdentifierBearers = await postgres
    .select()
    .from(temporary_identifier_bearers);
  return c.json(allTemporaryIdentifierBearers);
};

export const createTemporaryIdentifierBearer: AppRouteHandler<CreateTemporaryIdentifierBearerRoute> = async (c) => {
  const { temporaryIdentifierBearer, status } = c.req.valid("json");
  const [insertedTemporaryIdentifierBearer] = await postgres
    .insert(temporary_identifier_bearers)
    .values(temporaryIdentifierBearer)
    .returning();
  // FIX: El device_id deberia ser opcional cuando se crea el device
  status.temporary_identifier_bearer_id = insertedTemporaryIdentifierBearer.id;

  const [insertedStatus] = await postgres
    .insert(temporary_identifier_bearer_status)
    .values(status)
    .returning();

  const inserted = { temporaryIdentifierBearer: insertedTemporaryIdentifierBearer, status: insertedStatus };

  return c.json(inserted, HttpStatusCodes.OK);
};

export const getTemporaryIdentifierBearer: AppRouteHandler<GetTemporaryIdentifierBearerRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedTemporaryIdentifier] = await postgres
    .select()
    .from(temporary_identifiers)
    .where(eq(temporary_identifiers.factory_id, slug));

  if (!selectedTemporaryIdentifier) {
    return c.json(
      {
        message: "Temporary Identifier not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [selectedTemporaryIdentifierBearer] = await postgres
    .select()
    .from(temporary_identifier_bearers)
    .where(eq(temporary_identifier_bearers.temporary_identifier_id, selectedTemporaryIdentifier.id));

  if (!selectedTemporaryIdentifierBearer) {
    return c.json(
      {
        message: "Temporary Identifier Bearer not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedTemporaryIdentifierBearer, HttpStatusCodes.OK);
};

export const patchTemporaryIdentifierBearer: AppRouteHandler<PatchTemporaryIdentifierBearerRoute> = async (c) => {
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

  const [updatedTemporaryIdentifierBearer] = await postgres
    .update(temporary_identifier_bearers)
    .set(updates)
    .where(eq(temporary_identifier_bearers.id, id))
    .returning();

  if (!updatedTemporaryIdentifierBearer) {
    return c.json(
      {
        message: "Temporary Identifier Bearer not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedTemporaryIdentifierBearer, HttpStatusCodes.OK);
};

export const createTemporaryIdentifierBearerStatus: AppRouteHandler<CreateTemporaryIdentifierBearerStatusRoute> = async (c) => {
  const newTemporaryIdentifierBearerStatus = c.req.valid("json");
  const [inserted] = await postgres
    .insert(temporary_identifier_bearer_status)
    .values(newTemporaryIdentifierBearerStatus)
    .returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getTemporaryIdentifierBearerStatus: AppRouteHandler<GetTemporaryIdentifierBearerStatusRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedTemporaryIdentifier] = await postgres
    .select()
    .from(temporary_identifiers)
    .where(eq(temporary_identifiers.factory_id, slug));

  if (!selectedTemporaryIdentifier) {
    return c.json(
      {
        message: "Temporary Identifier not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [selectedTemporaryIdentifierBearer] = await postgres
    .select()
    .from(temporary_identifier_bearers)
    .where(eq(temporary_identifier_bearers.temporary_identifier_id, selectedTemporaryIdentifier.id));

  if (!selectedTemporaryIdentifierBearer) {
    return c.json(
      {
        message: "Temporary Identifier Bearer not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [selectedTemporaryIdentifierBearerStatus] = await postgres
    .select()
    .from(temporary_identifier_bearer_status)
    .where(eq(temporary_identifier_bearer_status.temporary_identifier_bearer_id, selectedTemporaryIdentifierBearer.id))
    .orderBy(desc(temporary_identifier_bearer_status.id))
    .limit(1);

  if (!selectedTemporaryIdentifierBearerStatus) {
    return c.json(
      {
        message: "Temporary Identifier Bearer Status not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedTemporaryIdentifierBearerStatus, HttpStatusCodes.OK);
};
