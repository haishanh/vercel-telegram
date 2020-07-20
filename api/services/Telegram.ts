import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

type SendMessageParams = {
  chat_id: number;
  text: string;
  parse_mode?: string;
};

export class TelegramService {
  constructor(token: string) {
    this.axios = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.baseUrl = "https://api.telegram.org/bot" + token;
  }

  private baseUrl: string;
  private axios: AxiosInstance;

  async sendMessage(body: SendMessageParams) {
    const { baseUrl } = this;
    const url = `${baseUrl}/sendMessage`;
    try {
      const res: AxiosResponse = await this.axios.post(url, {
        parse_mode: "MarkdownV2",
        ...body,
      });
      console.log(res.data);
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