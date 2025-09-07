import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./device.handlers";
import * as routes from "./device.routes";

const deviceRoleRouter = createRouter();
deviceRoleRouter.use(authMiddleware);
deviceRoleRouter
  .openapi(routes.allDeviceRoles, handlers.allDeviceRoles)
  .openapi(routes.createDeviceRole, handlers.createDeviceRole)
  .openapi(routes.createDeviceRoleStatus, handlers.createDeviceRoleStatus)
  .openapi(routes.getDeviceRoleStatus, handlers.getDeviceRoleStatus)
  .openapi(routes.getDeviceRole, handlers.getDeviceRole)
  .openapi(routes.patchDeviceRole, handlers.patchDeviceRole);

export default deviceRoleRouter;
