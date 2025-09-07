import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./devices.handlers";
import * as routes from "./devices.routes";

const deviceRouter = createRouter();
deviceRouter.use(authMiddleware);
deviceRouter
  .openapi(routes.allDevices, handlers.allDevices)
  .openapi(routes.createDevice, handlers.createDevice)
  .openapi(routes.createDeviceStatus, handlers.createDeviceStatus)
  .openapi(routes.getDeviceStatus, handlers.getDeviceStatus)
  .openapi(routes.getDevice, handlers.getDevice)
  .openapi(routes.patchDevice, handlers.patchDevice);

export default deviceRouter;
