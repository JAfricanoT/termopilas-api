import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";


const actionRouter = createRouter();
actionRouter.use(authMiddleware);
actionRouter
  // .openapi(routes.executeAction, handlers.executeAction)

export default actionRouter;
