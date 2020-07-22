import { FastifyInstance, FastifyRequest } from "fastify";
import axios, { AxiosInstance, AxiosError } from "axios";

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
    try {
      const res = await this.axios.post(url, payload);
      return res.data;
    } catch (e) {
      this.handleAPIError(e);
    }
  }

  handleAPIError(e: AxiosError) {
    if (e.response) {
      const msg = JSON.stringify(e.response.data);
      // I am lazy :(
      throw new Error(`${e.response.status}:${msg}`);
    } else if (e.request) {
      // network error
      throw new Error(`network:error:${e.code}`);
    }
    throw e;
  }
}
