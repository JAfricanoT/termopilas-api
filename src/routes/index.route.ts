import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { createRouter } from "@/lib/create-app";

const router = createRouter()
  .openapi(
    createRoute({
      tags: ["Index"],
      method: "get",
      path: "/",
      responses: {
        [HttpStatusCodes.OK]: jsonContent(
          createMessageObjectSchema("Termopilas API"),
          "Termopilas API Home by LIDA",
        ),
      },
    }),
    (c) => {
      return c.json({
        message: "Termopilas API",
      }, HttpStatusCodes.OK);
    },
  );

export default router;
