import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { responsesIdentifierLogsSchema, responsesTemporaryIdentifierLogsSchema } from "@/db/postgres/schemas/logs/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Gates"];

export const executeAction = createRoute({
  tags,
  path: "/gates/execute",
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
      responsesIdentifierLogsSchema.or(responsesTemporaryIdentifierLogsSchema),
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
