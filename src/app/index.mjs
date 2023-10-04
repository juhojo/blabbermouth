import { Hono } from "hono";
import { API_VERSION } from "../config.mjs";
import api from "./api/index.mjs";
import { serve } from "@hono/node-server";

const app = new Hono();

app.route(`/api/${API_VERSION}`, api);

serve({
  fetch: app.fetch,
  port: 3000,
});
