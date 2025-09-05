import { createRouter } from "@/lib/create-app";

import { authMiddleware } from "@/middlewares/auth-middleware";
import * as handlers from "./users.handlers";
import * as routes from "./users.routes";

const router = createRouter()

router.use(authMiddleware)

router
  .openapi(routes.allUsers, authMiddleware, handlers.allUsers)
  .openapi(routes.createUser, handlers.createUser)

export default router;
