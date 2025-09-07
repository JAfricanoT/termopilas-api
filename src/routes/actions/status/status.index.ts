import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./status.handlers";
import * as routes from "./status.routes";

const actionStatusRouter = createRouter();
actionStatusRouter.use(authMiddleware);
actionStatusRouter
  .openapi(routes.createActionStatus, handlers.createActionStatus)
  .openapi(routes.getActionStatus, handlers.getActionStatus)

export default actionStatusRouter;
