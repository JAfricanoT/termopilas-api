import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./status.handlers";
import * as routes from "./status.routes";

const userRouter = createRouter();
userRouter.use(authMiddleware);
userRouter
  .openapi(routes.createUserStatus, handlers.createUserStatus)
  .openapi(routes.getUserStatus, handlers.getUserStatus)

export default userRouter;
