import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./bearer.handlers";
import * as routes from "./bearer.routes";

const temporaryIdentifierRouter = createRouter();
temporaryIdentifierRouter.use(authMiddleware);
temporaryIdentifierRouter
  .openapi(routes.allTemporaryIdentifierBearers, handlers.allTemporaryIdentifierBearers)
  .openapi(routes.createTemporaryIdentifierBearer, handlers.createTemporaryIdentifierBearer)
  .openapi(routes.getTemporaryIdentifierBearer, handlers.getTemporaryIdentifierBearer)
  .openapi(routes.patchTemporaryIdentifierBearer, handlers.patchTemporaryIdentifierBearer)

export default temporaryIdentifierRouter;
