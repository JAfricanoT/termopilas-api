import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./gates.handlers";
import * as routes from "./gates.routes";

const gateRouter = createRouter();
gateRouter.use(authMiddleware);
gateRouter
  .openapi(routes.allGates, handlers.allGates)
  .openapi(routes.getGate, handlers.getGate)

export default gateRouter;
