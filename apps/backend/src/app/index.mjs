import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { cors } from "hono/cors";

import { API_PORT, API_VERSION } from "../config.mjs";
import api from "./api/index.mjs";

const app = new Hono();

app.use("*", poweredBy());
app.use("*", logger());

// TODO: configure cors
app.use("/api/*", cors());
app.route(`/api/${API_VERSION}`, api);
app.use(
  "/api/swagger/*",
  serveStatic({
    root: "./src/app/",
  }),
);

serve({
  fetch: app.fetch,
  port: API_PORT,
});
