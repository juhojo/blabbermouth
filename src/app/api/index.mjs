import { Hono } from "hono";

const api = new Hono();

api.get("/", (c) => {
  return c.json({ status: true });
});

export default api;
