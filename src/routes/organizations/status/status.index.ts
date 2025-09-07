import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./status.handlers";
import * as routes from "./status.routes";

const organizationRouter = createRouter();
organizationRouter.use(authMiddleware);
organizationRouter
  .openapi(routes.createOrganizationStatus, handlers.createOrganizationStatus)
  .openapi(routes.getOrganizationStatus, handlers.getOrganizationStatus)

export default organizationRouter;
