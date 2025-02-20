import { NextApiRequest, NextApiResponse } from "next";
import { webhookHandler } from "./webhook";
import { WebhookEventCreate, WebhookEventRequest } from "./shared.types";
import { insertWebhookEvent } from "./db";


jest.mock("./db", () => ({
  insertWebhookEvent: jest.fn().mockResolvedValue({}),
}));

describe("webhookHandler", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;
  const webhookEventRequest: WebhookEventRequest = {
    meta: { event_name: "subscription_created" },
    type: "subscriptions",
  };
  const webhookEventCreate: WebhookEventCreate = {
    event_name: "subscription_created",
    payload: JSON.stringify(webhookEventRequest),
    event_type: "subscriptions",
  };

  beforeEach(() => {
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({
      json: jsonMock,
      send: sendMock,
    });
    req = {
      body: {},
    };
    res = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };
  });

  afterEach(() => {
    (insertWebhookEvent as jest.Mock).mockClear();
    jsonMock.mockClear();
    sendMock.mockClear();
    statusMock.mockClear();
  });

  it("should send 200 response", async () => {
    req.body = webhookEventRequest;
    await webhookHandler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("Webhook received");
  });

  it("should write webhook event data to postgress database", async () => {
    req.body = webhookEventRequest;

    await webhookHandler(req as NextApiRequest, res as NextApiResponse);

    expect(insertWebhookEvent).toHaveBeenCalledWith(webhookEventCreate);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should respond with 400 if signature verification fails", async () => {
    throw new Error("not implemented.");
  });
});
