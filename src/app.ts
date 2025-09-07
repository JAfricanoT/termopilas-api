import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import devices from "@/routes/devices/devices.index";
import identifiers from "@/routes/identifiers/identifiers.index";
import temporaryIdentifiers from "@/routes/identifiers/temporary/temporary.index";
import index from "@/routes/index.route";
import organizations from "@/routes/organizations/organizations.index";
import deviceRole from "@/routes/roles/device/device.index";
import userRole from "@/routes/roles/user/user.index";
import users from "@/routes/users/users.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  temporaryIdentifiers,
  identifiers,
  userRole,
  deviceRole,
  users,
  devices,
  organizations,
  index,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
