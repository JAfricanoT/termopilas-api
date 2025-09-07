import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { identifier_status, identifiers } from "@/db/postgres/schemas/identifiers/schema";

import type { CreateIdentifierStatusRoute, GetIdentifierStatusRoute } from "./status.routes";

export const createIdentifierStatus: AppRouteHandler<CreateIdentifierStatusRoute> = async (c) => {
  const newIdentifierStatus = c.req.valid("json");
  const [inserted] = await postgres
    .insert(identifier_status)
    .values(newIdentifierStatus)
    .returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getIdentifierStatus: AppRouteHandler<GetIdentifierStatusRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedIdentifier] = await postgres
    .select()
    .from(identifiers)
    .where(eq(identifiers.identifier_id, slug));

  const [selectedIdentifierStatus] = await postgres
    .select()
    .from(identifier_status)
    .where(eq(identifier_status.identifier_id, selectedIdentifier.id))
    .orderBy(desc(identifier_status.id))
    .limit(1);

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
