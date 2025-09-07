import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./execute.handlers";
import * as routes from "./execute.routes";

const executeActionRouter = createRouter();
executeActionRouter.use(authMiddleware);
executeActionRouter
  .openapi(routes.executeAction, handlers.executeAction)

export default executeActionRouter;
