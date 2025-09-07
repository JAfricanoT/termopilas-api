import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./info.handlers";
import * as routes from "./info.routes";

const userRouter = createRouter();
userRouter.use(authMiddleware);
userRouter
  .openapi(routes.createUserInformation, handlers.createUserInformation)
  .openapi(routes.getUserInformation, handlers.getUserInformation)
  .openapi(routes.patchUserInformation, handlers.patchUserInformation);

export default userRouter;
