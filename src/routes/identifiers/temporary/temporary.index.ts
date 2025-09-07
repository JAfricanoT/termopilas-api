import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./temporary.handlers";
import * as routes from "./temporary.routes";

const temporaryIdentifierRouter = createRouter();
temporaryIdentifierRouter.use(authMiddleware);
temporaryIdentifierRouter
  .openapi(routes.allTemporaryIdentifiers, handlers.allTemporaryIdentifiers)
  .openapi(routes.createTemporaryIdentifier, handlers.createTemporaryIdentifier)
  .openapi(routes.allTemporaryIdentifierBearers, handlers.allTemporaryIdentifierBearers)
  .openapi(routes.createTemporaryIdentifierBearer, handlers.createTemporaryIdentifierBearer)
  .openapi(routes.createTemporaryIdentifierBearerStatus, handlers.createTemporaryIdentifierBearerStatus)
  .openapi(routes.getTemporaryIdentifierBearerStatus, handlers.getTemporaryIdentifierBearerStatus)
  .openapi(routes.getTemporaryIdentifierBearer, handlers.getTemporaryIdentifierBearer)
  .openapi(routes.getTemporaryIdentifier, handlers.getTemporaryIdentifier)
  .openapi(routes.patchTemporaryIdentifierBearer, handlers.patchTemporaryIdentifierBearer)
  .openapi(routes.patchTemporaryIdentifier, handlers.patchTemporaryIdentifier);

export default temporaryIdentifierRouter;
