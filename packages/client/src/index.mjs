import { z } from "zod";
import { WebSocket } from "ws";

/**
 * WebSocket client
 *
 * @param {string} urlString config key URL string
 * @param {Function} onConfigUpdate config change listener
 */
export const Client = (urlString, onConfigUpdate) => {
  const url = new URL(urlString);

  const paramSchema = z.object({
    origin: z
      .string()
      .regex(/ws:\/\/(localhost|example\.com)(?:(:[0-9]{4,5}))?/),
    ck: z.string().cuid2(),
    onConfigUpdate: z.function(),
  });
  paramSchema.parse({
    origin: url.origin,
    ck: url.searchParams.get("ck"),
    onConfigUpdate,
  });

  const ws = new WebSocket(urlString);

  ws.on("message", (data) => {
    onConfigUpdate(JSON.parse(data.toString()));
  });
};
