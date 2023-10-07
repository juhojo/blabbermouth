import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import { API_VERSION } from "../config.mjs";
import api from "./api/index.mjs";

const app = new Hono();

app.use("*", poweredBy());
app.use("*", logger());

app.route(`/api/${API_VERSION}`, api);
app.use("/swagger/*", serveStatic({ root: "./" }));

serve({
  fetch: app.fetch,
  port: 3000,
});
