import { FastifyInstance, FastifyRequest } from "fastify";
import axios, { AxiosInstance } from "axios";

type ProxyRequest = FastifyRequest<{
  Params: { endpoint: string };
}>;

export default async function (app: FastifyInstance) {
  app.addHook("preValidation", app.authenticate);

  const proxySvc = new TgProxyService(app.config.get("botToken0"));

  app.post("/:endpoint", async (req: ProxyRequest) => {
    const { body, params } = req;
    const { endpoint } = params;
    return proxySvc.proxy(endpoint, body);
  });
}

////////////////////

class TgProxyService {
  private baseUrl: string;
  private axios: AxiosInstance;

  constructor(token: string) {
    this.axios = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.baseUrl = "https://api.telegram.org/bot" + token;
  }

  // only supporting POST method for now
  async proxy(endpoint: string, payload: unknown) {
    const { baseUrl } = this;
    const url = `${baseUrl}/${endpoint}`;
    return await this.axios.post(url, payload);
  }
}
