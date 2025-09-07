import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./status.handlers";
import * as routes from "./status.routes";

const deviceRouter = createRouter();
deviceRouter.use(authMiddleware);
deviceRouter
  .openapi(routes.createDeviceStatus, handlers.createDeviceStatus)
  .openapi(routes.getDeviceStatus, handlers.getDeviceStatus)

export default deviceRouter;
