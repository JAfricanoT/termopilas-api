import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./identifiers.handlers";
import * as routes from "./identifiers.routes";

const identifierRouter = createRouter();
identifierRouter.use(authMiddleware);
identifierRouter
  .openapi(routes.allIdentifiers, handlers.allIdentifiers)
  .openapi(routes.createIdentifier, handlers.createIdentifier)
  .openapi(routes.getIdentifier, handlers.getIdentifier)
  .openapi(routes.patchIdentifier, handlers.patchIdentifier);

export default identifierRouter;
