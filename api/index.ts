import fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyServerOptions,
  preValidationHookHandler,
} from "fastify";
import fp from "fastify-plugin";
import fastifyJWT from "fastify-jwt";
import { Server, IncomingMessage, ServerResponse } from "http";
import { TelegramService } from "./services";

import * as config from "./config";
import RouteWebhook from "./routes/webhook";
import RoutePing from "./routes/ping";
import RouteProxy from "./routes/tgproxy";

// "shared" decorations
async function decorateFastifyInstance(fastify: FastifyInstance) {
  fastify.decorate("config", config);
  fastify.decorate("telegram", new TelegramService(config.get("botToken0")));

  fastify.register(fastifyJWT, { secret: config.get("jwtSecret") });
  fastify.decorate("authenticate", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

declare module "fastify" {
  interface FastifyInstance {
    config: typeof config;
    telegram: TelegramService;
    authenticate: preValidationHookHandler;
  }
}

export function build(opts: FastifyServerOptions = {}): FastifyInstance {
  const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify(
    opts
  );

  app
    .register(fp(decorateFastifyInstance))
    .register(RouteWebhook, { prefix: "/api/webhook/v1" })
    .register(RouteProxy, { prefix: "/api/tgproxy/v1" })
    .register(RoutePing, { prefix: "/api/ping" });

  return app;
}
