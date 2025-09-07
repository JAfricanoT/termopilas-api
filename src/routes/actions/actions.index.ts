import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./actions.handlers";
import * as routes from "./actions.routes";

const actionRouter = createRouter();
actionRouter.use(authMiddleware);
actionRouter
  .openapi(routes.allActions, handlers.allActions)
  .openapi(routes.createAction, handlers.createAction)
  .openapi(routes.getAction, handlers.getAction)
  .openapi(routes.patchAction, handlers.patchAction);

export default actionRouter;
