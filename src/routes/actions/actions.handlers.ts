
import type { AppRouteHandler } from "@/lib/types";
import * as HttpStatusCodes from "stoker/http-status-codes";

import postgres from "@/db/postgres/postgres";
import { action_status, actions } from "@/db/postgres/schemas/actions/schema";

import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import { eq } from "drizzle-orm";
import type { AllActionsRoute, CreateActionRoute, GetActionRoute, PatchActionRoute } from "./actions.routes";

export const allActions: AppRouteHandler<AllActionsRoute> = async (c) => {
  const allActions = await postgres
    .select()
    .from(actions);
  return c.json(allActions);
};

export const createAction: AppRouteHandler<CreateActionRoute> = async (c) => {
  const { action, status } = c.req.valid("json");
  console.log({ action, status });
  const [insertedAction] = await postgres
    .insert(actions)
    .values(action)
    .returning();
  // FIX: El action_id deberia ser opcional cuando se crea el action
  console.log(status.action_id)
  status.action_id = insertedAction.id;
  console.log(status.action_id)

  const [insertedStatus] = await postgres
    .insert(action_status)
    .values(status)
    .returning();
  const inserted = { action: insertedAction, status: insertedStatus };

  // const inserted = {
  //   action: {
  //     id: 1,
  //     name: "SuperAdmin",
  //     description: "Control Total",
  //     created_by: 1,
  //     created_at: new Date(),
  //   }, status: {
  //     id: 1,
  //     action_id: 1,
  //     is_active: true,
  //     created_by: 1,
  //     created_at: new Date(),
  //   }
  // }
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getAction: AppRouteHandler<GetActionRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const [selectedAction] = await postgres
    .select()
    .from(actions)
    .where(eq(actions.id, id));

  if (!selectedAction) {
    return c.json(
      {
        message: "Action not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedAction, HttpStatusCodes.OK);
};

export const patchAction: AppRouteHandler<PatchActionRoute> = async (c) => {
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

  const [updatedUser] = await postgres
    .update(actions)
    .set(updates)
    .where(eq(actions.id, id))
    .returning();

  if (!updatedUser) {
    return c.json(
      {
        message: "Action not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedUser, HttpStatusCodes.OK);
};
