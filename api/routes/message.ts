import { FastifyInstance, FastifyRequest } from "fastify";

export default async function (app: FastifyInstance) {
  app.addHook("preValidation", app.authenticate);

  app.get("/", async (req: FastifyRequest) => {
    return req.user;
  });
}
