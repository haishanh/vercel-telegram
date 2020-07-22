import { FastifyInstance, FastifyRequest } from "fastify";
import { HttpException } from "../common/error";

const ResponseSync = {
  200: {
    type: "object",
    properties: {
      ok: {
        type: "number",
      },
    },
  },
};

const SchemaStartSyncOne = {
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
  response: ResponseSync,
};

type Chat = {
  id: number;
  first_name: string;
  username: string;
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

export default async function (app: FastifyInstance) {
  app.post("/:id", { schema: SchemaStartSyncOne }, async (req: PostRequest) => {
    // app.post("/:id", async (req: PostRequest) => {
    const { body, params } = req;
    const { id } = params;
    const configedId = app.config.get("webhookId0");
    if (id !== configedId) {
      throw new HttpException(400, "Parameters Error");
    }

    const { chat, text } = body.message;
    req.log.info({ chat, text });

    await handleWebookMessage(app, text, chat);

    return { ok: 1 };
  });
}

////////////////////

async function handleWebookMessage(
  app: FastifyInstance,
  text: string,
  chat: Chat
) {
  const t = text.trim();
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
