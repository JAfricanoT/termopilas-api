import { createRouter } from "@/lib/create-app";

import { authMiddleware } from "@/middlewares/auth-middleware";
import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const userRouter = createRouter()
userRouter.use(authMiddleware);
userRouter
  .openapi(routes.allUsers, handlers.allUsers)
  .openapi(routes.createUser, handlers.createUser)
  .openapi(routes.getUser, handlers.getUser)
  .openapi(routes.patchUser, handlers.patchUser)

export default userRouter;
