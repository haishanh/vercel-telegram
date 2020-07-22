const env = process.env;

const config = {
  // a secret string which we will use as part of the webhook url
  // just to prevent people from hitting that endpoint
  webhookId0: env.WEBHOOK_ID_0,
  // the format is something like:
  // 1382139262:ABF4535Sm3J12gQcUJSYv79SGbZ6_ULACrw
  botToken0: env.BOT_TOKEN_0,
  jwtSecret: env.JWT_SECRET,
};

export function get(key: string) {
  return config[key];
}
