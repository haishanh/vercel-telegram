import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const config = {
  webhookId0: env.WEBHOOK_ID_0,
  botToken0: env.BOT_TOKEN_0,
};

export function get(key: string) {
  return config[key];
}
