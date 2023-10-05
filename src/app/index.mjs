import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import { API_VERSION } from "../config.mjs";
import api from "./api/index.mjs";

const app = new Hono();

app.route(`/api/${API_VERSION}`, api);
app.use("/swagger/*", serveStatic({ root: "./" }));

serve({
  fetch: app.fetch,
  port: 3000,
});
