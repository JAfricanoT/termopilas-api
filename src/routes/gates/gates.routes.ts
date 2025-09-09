import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { constGateDeviceSchema, selectGatesSchema } from "@/db/postgres/schemas/gates/schema";
import { notFoundSchema } from "@/lib/constants";
const tags = ["Gates"];

export const allGates = createRoute({
  tags,
  path: "/gates",
  method: "get",
  security: [{ bearerAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectGatesSchema),
      "The list of actions",
    ),
  },
});

export const getGate = createRoute({
  tags,
  path: "/gates/{id}",
  method: "get",
  security: [{ bearerAuth: [] }],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      constGateDeviceSchema,
      "The requested action",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Action not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type AllGatesRoute = typeof allGates;
export type GetGateRoute = typeof getGate;
