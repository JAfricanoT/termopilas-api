import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./devices.handlers";
import * as routes from "./devices.routes";

const userRouter = createRouter();
userRouter.use(authMiddleware);
userRouter
  .openapi(routes.allDevices, handlers.allDevices)
  .openapi(routes.createDevice, handlers.createDevice)
  .openapi(routes.getDevice, handlers.getDevice)
  .openapi(routes.patchDevice, handlers.patchDevice)
  .openapi(routes.createDeviceStatus, handlers.createDeviceStatus)
  .openapi(routes.getDeviceStatus, handlers.getDeviceStatus);

export default userRouter;
