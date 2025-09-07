import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./status.handlers";
import * as routes from "./status.routes";

const deviceRoleRouter = createRouter();
deviceRoleRouter.use(authMiddleware);
deviceRoleRouter
  .openapi(routes.createDeviceRoleStatus, handlers.createDeviceRoleStatus)
  .openapi(routes.getDeviceRoleStatus, handlers.getDeviceRoleStatus)

export default deviceRoleRouter;
