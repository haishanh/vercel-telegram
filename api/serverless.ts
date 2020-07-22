import { build } from "./index";
import * as http from "http";

const app = build({ logger: true });

module.exports = async function (
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  await app.ready();
  app.server.emit("request", req, res);
};
