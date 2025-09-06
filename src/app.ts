import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import devices from "@/routes/devices/devices.index";
import index from "@/routes/index.route";
import keys from "@/routes/keys/keys.index";
import users from "@/routes/users/users.index";

const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  users,
  devices,
  keys,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
