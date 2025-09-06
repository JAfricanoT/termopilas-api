import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import devices from "@/routes/devices/devices.index";
import identifiers from "@/routes/identifiers/identifiers.index";
import index from "@/routes/index.route";
import organizations from "@/routes/organizations/organizations.index";
import users from "@/routes/users/users.index";
const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  users,
  devices,
  identifiers,
  organizations
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
