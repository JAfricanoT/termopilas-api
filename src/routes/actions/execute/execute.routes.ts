import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { selectIdentifierLogsSchema, selectTemporaryIdentifierLogsSchema } from "@/db/postgres/schemas/logs/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Actions"];

export const executeAction = createRoute({
  tags,
  path: "/actions/execute",
  method: "post",
  security: [{ bearerAuth: [] }],
  request: {
    body: jsonContentRequired(
      z.object({
        device_id: z.string(),
        identifier_id: z.string(),
      }),
      "The action to execute",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectIdentifierLogsSchema.or(selectTemporaryIdentifierLogsSchema),
      "The action executed",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Device not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type ExecuteActionRoute = typeof executeAction;
