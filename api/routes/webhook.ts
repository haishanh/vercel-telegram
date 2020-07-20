import { FastifyInstance } from "fastify";
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

export default async function (app: FastifyInstance) {
  app.post("/:id", { schema: SchemaStartSyncOne }, async (req) => {
    const { body, params } = req;
    const { id } = params;
    const configedId = app.config.get("webhookId0");
    if (id !== configedId) {
      throw new HttpException(400, "Parameters Error");
    }

    const { chat } = body.message;
    // XXX probably should also check if user is using the chatid command
    // body.message.text === '/chatid'

    await app.telegram.sendMessage({
      chat_id: chat.id,
      text: `Your chatId is \`${chat.id}\``,
    });

    return { ok: 1 };
  });
}
