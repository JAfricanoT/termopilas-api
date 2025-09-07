import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./status.handlers";
import * as routes from "./status.routes";

const temporaryIdentifierRouter = createRouter();
temporaryIdentifierRouter.use(authMiddleware);
temporaryIdentifierRouter
  .openapi(routes.createTemporaryIdentifierBearerStatus, handlers.createTemporaryIdentifierBearerStatus)
  .openapi(routes.getTemporaryIdentifierBearerStatus, handlers.getTemporaryIdentifierBearerStatus)

export default temporaryIdentifierRouter;
