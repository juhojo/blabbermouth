import { Hono } from "hono";
import swaggerJSDoc from "swagger-jsdoc";

import { API_VERSION } from "../../config.mjs";
import authApi from "./auth/index.mjs";
import usersApi from "./users/index.mjs";

const api = new Hono();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     NoContent:
 *       description: No content.
 *     EmptyResponse:
 *       description: Empty response.
 */

/**
 * @openapi
 * /api/v1:
 *   get:
 *     description: API version.
 *     responses:
 *       200:
 *         description: Returns API version.
 */
api.get("/", (c) => {
  return c.json({ version: API_VERSION });
});

api.get("/spec.json", (c) => {
  const options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Blabbermouth",
        version: "1.0.0",
      },
    },
    apis: ["./src/app/api/**/*.mjs"],
  };

  const spec = swaggerJSDoc(options);

  return c.json(spec);
});

api.route("/auth", authApi);
api.route("/users", usersApi);

export default api;
