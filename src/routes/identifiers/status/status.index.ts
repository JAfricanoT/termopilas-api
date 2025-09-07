import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./status.handlers";
import * as routes from "./status.routes";

const identifierRouter = createRouter();
identifierRouter.use(authMiddleware);
identifierRouter
  .openapi(routes.createIdentifierStatus, handlers.createIdentifierStatus)
  .openapi(routes.getIdentifierStatus, handlers.getIdentifierStatus)

export default identifierRouter;
