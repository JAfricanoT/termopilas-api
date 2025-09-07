import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { temporary_identifier_bearer_status, temporary_identifier_bearers, temporary_identifiers } from "@/db/postgres/schemas/identifiers/temporary/schema";

import type { CreateTemporaryIdentifierBearerStatusRoute, GetTemporaryIdentifierBearerStatusRoute } from "./status.routes";

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
