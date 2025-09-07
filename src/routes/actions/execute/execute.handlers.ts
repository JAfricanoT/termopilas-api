import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { action_status, actions } from "@/db/postgres/schemas/actions/schema";

import type { ExecuteActionRoute } from "./execute.routes";

export const executeAction: AppRouteHandler<ExecuteActionRoute> = async (c) => {
  const { action, status } = c.req.valid("json");
  const [insertedAction] = await postgres
    .insert(actions)
    .values(action)
    .returning();
  // FIX: El action_id deberia ser opcional cuando se crea el action
  status.action_id = insertedAction.id;
  const [insertedStatus] = await postgres
    .insert(action_status)
    .values(status)
    .returning();
  const inserted = { action: insertedAction, status: insertedStatus };
  return c.json(inserted, HttpStatusCodes.OK);
};
