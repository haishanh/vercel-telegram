import { FastifyInstance } from "fastify";
import { arch, cpus, release, platform, type, totalmem } from "os";

export default async function (app: FastifyInstance) {
  app.get("/", async (_req) => {
    return { time: new Date().toISOString() };
  });

  app.get("/details", async (_req) => {
    return {
      arch: arch(),
      cpus: cpus(),
      release: release(),
      platform: platform(),
      type: type(),
      totalmem: totalmem(),
    };
  });
}
