import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./status.handlers";
import * as routes from "./status.routes";

const userRoleRouter = createRouter();
userRoleRouter.use(authMiddleware);
userRoleRouter
  .openapi(routes.createUserRoleStatus, handlers.createUserRoleStatus)
  .openapi(routes.getUserRoleStatus, handlers.getUserRoleStatus);

export default userRoleRouter;
