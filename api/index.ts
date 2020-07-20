import fastify from "fastify";
import fp from "fastify-plugin";
import { Server, IncomingMessage, ServerResponse } from "http";
import { TelegramService } from "./services";

import * as config from "./config";
import RouteWebhook from "./routes/webhook";
import RoutePing from "./routes/ping";

// "shared" decorations
async function decorateFastifyInstance(fastify: fastify.FastifyInstance) {
  fastify.decorate("config", config);
  fastify.decorate("telegram", new TelegramService(config.get("botToken0")));
}

declare module "fastify" {
  interface FastifyInstance {
    config: typeof config;
    telegram: TelegramService;
  }
}

export function build() {
  const app: fastify.FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
  > = fastify({ logger: true });

  app
    .register(fp(decorateFastifyInstance))
    .register(RouteWebhook, { prefix: "/api/webhook/v1" })
    .register(RoutePing, { prefix: "/api/ping" });

  return app;
}
