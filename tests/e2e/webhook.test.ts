import { FastifyInstance } from "fastify";
import request from "supertest";
import { build } from "api/index";

describe("POST /api/webhook/v1/:id", () => {
  let app: FastifyInstance;
  const input = {
    message: {
      chat: {
        id: 3,
        first_name: "Alice",
        username: "alice",
        type: "private",
      },
      text: "/chatid",
    },
  };

  beforeAll(async () => {
    app = build();
    await app.ready();
  });
  it("should reject if request payload is invalid", async () => {
    const res = await request(app.server)
      .post("/api/webhook/v1/123")
      .send({ some: "prop" });

    expect(res.body).toEqual({
      statusCode: 400,
      error: "Bad Request",
      message: "Parameters Error",
    });
  });

  it("should reject if id mismatch", async () => {
    const res = await request(app.server)
      .post("/api/webhook/v1/123")
      .send(input);

    expect(res.body).toEqual({
      statusCode: 400,
      error: "Bad Request",
      message: "Parameters Error",
    });
  });

  it("should sendMessage", async () => {
    jest
      .spyOn(app.telegram, "sendMessage")
      .mockImplementationOnce(() => Promise.resolve());

    const res = await request(app.server)
      .post("/api/webhook/v1/test_webhook_id")
      .send(input);

    expect(res.body).toEqual({ ok: 1 });
  });
});
