import WebSocket, { WebSocketServer } from "ws";
import { ConfigModel } from "../../db/configs/index.mjs";

const wss = new WebSocketServer({ noServer: true });

/**
 * Send a message to all clients that are listening for config changes
 *
 * @param {import("../../db/schema.mjs").ConfigWithFields} config
 * @returns
 */
const notifyConfigClient =
  (config) =>
  /** @param {WebSocket} client */
  (client) => {
    if (
      client.readyState === WebSocket.OPEN &&
      client.ck === config.key.value
    ) {
      client.send(
        JSON.stringify({
          id: config.id,
          fields: config.fields,
        }),
      );
    }
  };

/**
 * Act on config update, fetches updated config and starts to
 * notify all clients listening for config changes
 *
 * @param {number} configId
 */
export const onConfigUpdated = async (configId) => {
  const config = await ConfigModel.getRowById(configId);

  wss.clients.forEach(notifyConfigClient(config));
};

wss.on("connection", (ws, request, ck) => {
  ws.ck = ck;

  ws.on("error", console.error);
  ws.on("close", () => console.log("Client has disconnected"));
});

export default wss;
