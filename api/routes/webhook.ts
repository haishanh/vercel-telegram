import { FastifyInstance, FastifyRequest } from "fastify";
import { HttpException } from "../common/error";

const ResponseWebhook = {
  200: {
    type: "object",
    properties: {
      ok: {
        type: "number",
      },
    },
  },
};

const _SchemaWebhook = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
      },
    },
  },
  // various incoming body example can be found here:
  // https://core.telegram.org/bots/webhooks#testing-your-bot-with-updates
  body: {
    type: "object",
    required: ["message"],
    properties: {
      message: {
        type: "object",
        required: ["chat", "text"],
        properties: {
          chat: {
            type: "object",
            required: ["id", "type"],
            properties: {
              id: {
                type: "number",
              },
              first_name: {
                type: "string",
              },
              username: {
                type: "string",
              },
              type: {
                type: "string",
              },
            },
          },
          text: {
            type: "string",
          },
        },
      },
    },
  },
  response: ResponseWebhook,
};

type Chat = {
  id: number;
  first_name: string;
  username: string;
  // private, ...
  type: string;
};

type PostRequest = FastifyRequest<{
  Body: {
    message: {
      chat: Chat;
      text: string;
    };
  };
  Params: { id: string };
}>;

type ImageFile = {
  file_id: string;
  file_size: number;
  file_unique_id: string;
  height: number;
  width: number;
};
type _MessageWithSticker = {
  chat: Chat;
  // unix timestamp in seconds
  date: number;
  from: {
    first_name: string;
    id: number;
    is_bot: boolean;
    language_code: string;
    username: string;
  };
  message_id: number;
  sticker: ImageFile & {
    emoji: string;
    is_animated: boolean;
    set_name: string;
    thumb: ImageFile;
  };
};

export default async function (app: FastifyInstance) {
  // app.post("/:id", { schema: SchemaStartSyncOne }, async (req: PostRequest) => {
  app.post("/:id", async (req: PostRequest) => {
    const { body, params } = req;
    req.log.info(body, "request body");
    const { id } = params;
    const configedId = app.config.get("webhookId0");
    if (id !== configedId) {
      throw new HttpException(400, "Parameters Error");
    }

    const { chat, text } = body.message;

    await handleWebookMessage(app, text, chat);

    return { ok: 1 };
  });
}

////////////////////

async function handleWebookMessage(
  app: FastifyInstance,
  text: string | undefined,
  chat: Chat
) {
  const t = text?.trim();
  switch (t) {
    case "/token":
      const token = app.jwt.sign({ chatId: chat.id });
      await app.telegram.sendMessage({
        chat_id: chat.id,
        text: `\`${token}\``,
      });
      await app.telegram.sendMessage({
        chat_id: chat.id,
        text: "The above string is your notification token",
      });
      break;
    default:
      await app.telegram.sendMessage({
        chat_id: chat.id,
        text:
          "😢\n\nHey, I don't konw what to do with this command\n\nPlease send me something that I know\n\n🍬🍬🍬",
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: "/token",
              },
            ],
          ],
        },
      });
  }
}
