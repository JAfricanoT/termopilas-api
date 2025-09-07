import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { action_status, actions } from "@/db/postgres/schemas/actions/schema";

import type { CreateActionStatusRoute, GetActionStatusRoute } from "./status.routes";

export const createActionStatus: AppRouteHandler<CreateActionStatusRoute> = async (c) => {
  const newActionStatus = c.req.valid("json");
  const [inserted] = await postgres
    .insert(action_status)
    .values(newActionStatus)
    .returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getActionStatus: AppRouteHandler<GetActionStatusRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedAction] = await postgres
    .select()
    .from(actions)
    .where(eq(actions.id, id));

  const [selectedActionStatus] = await postgres
    .select()
    .from(action_status)
    .where(eq(action_status.action_id, selectedAction.id))
    .orderBy(desc(action_status.id))
    .limit(1);

  if (!selectedActionStatus) {
    return c.json(
      {
        message: "Action Status not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedActionStatus, HttpStatusCodes.OK);
};
