import { NextApiRequest, NextApiResponse } from "next";
import { webhookHandler } from "./webhook";
import { WebhookEventCreate, WebhookEventRequest } from "./shared.types";
import { insertWebhookEvent } from "./db";
import { rawBodyMiddleware } from "./middleware";
import { Logger } from "./Logger";

const webhookEventRequest: WebhookEventRequest = {
  meta: { event_name: "subscription_created" },
  type: "subscriptions",
};
const webhookEventCreate: WebhookEventCreate = {
  event_name: "subscription_created",
  payload: JSON.stringify(webhookEventRequest),
  event_type: "subscriptions",
};

jest.mock("./db", () => ({
  insertWebhookEvent: jest.fn().mockResolvedValue({}),
}));

jest.mock("./Logger", () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn()
  }
}));

jest.mock("./middleware", () => ({
  rawBodyMiddleware: jest.fn((req, res, next) => {
    // Immediately call next to resolve the middleware
    req.body = webhookEventRequest;
    req.rawBody = JSON.stringify(webhookEventRequest);
    next();
  }),
}));
const isValidSignature = jest.fn().mockReturnValue(true);
// 1. Mock SignatureVerifier class, returning an object that has an isValidSignature mock.
jest.mock("./signatureVerifier", () => {
  return jest.fn().mockImplementation(() => {
    return {
      isValidSignature
    };
  });
});

describe("webhookHandler", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({
      json: jsonMock,
      send: sendMock,
    });
    req = {
      headers: {
        "x-signature": "valid_signature",
      },
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
    (rawBodyMiddleware as jest.Mock).mockClear();
    jsonMock.mockClear();
    sendMock.mockClear();
    statusMock.mockClear();
    isValidSignature.mockClear();
  });

  it("logs executing", async () => {
    req.body = webhookEventRequest;
    await webhookHandler(req as NextApiRequest, res as NextApiResponse);
    expect(Logger.info).toHaveBeenCalledWith(expect.stringContaining("Executing webhookHandler()."));
  });

  it("logs executed", async () => {
    req.body = webhookEventRequest;
    await webhookHandler(req as NextApiRequest, res as NextApiResponse);
    expect(Logger.info).toHaveBeenCalledWith("Executed webhookHandler().");
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

  it("should execute rawBodyMiddleware", async () => {
    req.body = webhookEventRequest;

    await webhookHandler(req as NextApiRequest, res as NextApiResponse);

    expect(rawBodyMiddleware).toHaveBeenCalled();
  });

  it("should verify signature", async () => {
    req.headers = {
      "x-signature": "valid_signature",
    };

    await webhookHandler(req as NextApiRequest, res as NextApiResponse);

    expect(isValidSignature).toHaveBeenCalledWith(JSON.stringify(req.body), "valid_signature");
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
