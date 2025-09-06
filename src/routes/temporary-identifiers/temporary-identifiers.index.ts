import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./temporary-identifiers.handlers";
import * as routes from "./temporary-identifiers.routes";

const temporaryIdentifierRouter = createRouter();
temporaryIdentifierRouter.use(authMiddleware);
temporaryIdentifierRouter
  .openapi(routes.allTemporaryIdentifiers, handlers.allTemporaryIdentifiers)
  .openapi(routes.createTemporaryIdentifier, handlers.createTemporaryIdentifier)
  .openapi(routes.getTemporaryIdentifier, handlers.getTemporaryIdentifier)
  .openapi(routes.patchTemporaryIdentifier, handlers.patchTemporaryIdentifier)
  .openapi(routes.allTemporaryIdentifierBearers, handlers.allTemporaryIdentifierBearers)
  .openapi(routes.createTemporaryIdentifierBearer, handlers.createTemporaryIdentifierBearer)
  .openapi(routes.getTemporaryIdentifierBearer, handlers.getTemporaryIdentifierBearer)
  .openapi(routes.patchTemporaryIdentifierBearer, handlers.patchTemporaryIdentifierBearer)
  .openapi(routes.createTemporaryIdentifierBearerStatus, handlers.createTemporaryIdentifierBearerStatus)
  .openapi(routes.getTemporaryIdentifierBearerStatus, handlers.getTemporaryIdentifierBearerStatus);

export default temporaryIdentifierRouter;
