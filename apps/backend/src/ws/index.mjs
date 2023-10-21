import { createServer } from "http";
import { KeyModel } from "../db/keys/index.mjs";
import wss from "./wss/index.mjs";
import { WSS_PORT } from "../config.mjs";

const server = createServer();

server.on("upgrade", async (req, socket, head) => {
  const url = new URL(req.url);
  const ck = url.searchParams.get("ck");

  if (!(await KeyModel.isValidKey(ck))) {
    // TODO: nicer response?
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req, ck);
  });
});

server.listen(WSS_PORT);
