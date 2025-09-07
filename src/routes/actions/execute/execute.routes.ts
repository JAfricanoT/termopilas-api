import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { insertNewActionSchema, selectNewActionSchema } from "@/db/postgres/schemas/actions/schema";

const tags = ["Actions"];

export const executeAction = createRoute({
  tags,
  path: "/actions/execute",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      insertNewActionSchema,
      "The action to execute",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectNewActionSchema,
      "The action executed",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(selectNewActionSchema),
      "The validation error(s)",
    ),
  },
});

export type ExecuteActionRoute = typeof executeAction;
