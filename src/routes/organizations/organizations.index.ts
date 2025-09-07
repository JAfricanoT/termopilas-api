import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";

import * as handlers from "./organizations.handlers";
import * as routes from "./organizations.routes";

const organizationRouter = createRouter();
organizationRouter.use(authMiddleware);
organizationRouter
  .openapi(routes.allOrganizations, handlers.allOrganizations)
  .openapi(routes.createOrganization, handlers.createOrganization)
  .openapi(routes.createOrganizationStatus, handlers.createOrganizationStatus)
  .openapi(routes.getOrganizationStatus, handlers.getOrganizationStatus)
  .openapi(routes.getOrganization, handlers.getOrganization)
  .openapi(routes.patchOrganization, handlers.patchOrganization);

export default organizationRouter;
