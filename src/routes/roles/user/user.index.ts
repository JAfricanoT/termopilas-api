import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./user.handlers";
import * as routes from "./user.routes";

const userRoleRouter = createRouter();
userRoleRouter.use(authMiddleware);
userRoleRouter
  .openapi(routes.allUserRoles, handlers.allUserRoles)
  .openapi(routes.createUserRole, handlers.createUserRole)
  .openapi(routes.createUserRoleStatus, handlers.createUserRoleStatus)
  .openapi(routes.getUserRoleStatus, handlers.getUserRoleStatus)
  .openapi(routes.getUserRole, handlers.getUserRole)
  .openapi(routes.patchUserRole, handlers.patchUserRole);

export default userRoleRouter;
