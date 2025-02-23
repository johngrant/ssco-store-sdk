import { NextRequest, NextResponse } from "next/server";
import { webhookHandler } from "./webhook";
import { WebhookEventCreate, WebhookEventRequest } from "./shared.types";
import { insertWebhookEvent } from "./db";
import { Logger } from "./Logger";
import { getRawBody } from "./getRawBody";

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

const isValidSignature = jest.fn().mockReturnValue(true);

// Mock SignatureVerifier class, returning an object that has an isValidSignature mock.
jest.mock("./SignatureVerifier", () => {
  return {
    SignatureVerifier: jest.fn().mockImplementation(() => {
      return {
        isValidSignature
      };
    })
  };
});

jest.mock("./getRawBody", () => ({
  getRawBody: jest.fn()
}));

jest.mock("next/server", () => {
  const originalModule = jest.requireActual("next/server");
  return {
    ...originalModule,
    NextResponse: {
      ...originalModule.NextResponse,
      json: jest.fn(),
    },
  };
});

class MockNextRequest extends NextRequest {
  constructor(body: object, headers: HeadersInit = {}) {
    super('http://localhost', { method: 'POST', headers });
    this._body = body;
  }

  private _body: object;

  async json() {
    return this._body;
  }

  async text() {
    return JSON.stringify(this._body);
  }
}

describe("webhookHandler", () => {
  let req: MockNextRequest;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    sendMock = jest.fn();
    (getRawBody as jest.Mock).mockResolvedValue(JSON.stringify(webhookEventRequest));
    statusMock = jest.fn().mockReturnValue({
      json: jsonMock,
      send: sendMock,
    });
    req = new MockNextRequest(webhookEventRequest, {
      "x-signature": "valid_signature",
    });
  });

  afterEach(() => {
    (insertWebhookEvent as jest.Mock).mockClear();
    jsonMock.mockClear();
    sendMock.mockClear();
    statusMock.mockClear();
    isValidSignature.mockClear();
    (getRawBody as jest.Mock).mockClear();
    (NextResponse.json as jest.Mock).mockClear();
  });

  it("logs executing", async () => {
    await webhookHandler(req as unknown as NextRequest);
    expect(Logger.info).toHaveBeenCalledWith(expect.stringContaining("Executing webhookHandler()."));
  });

  it("logs executed", async () => {
    await webhookHandler(req as unknown as NextRequest);
    expect(Logger.info).toHaveBeenCalledWith("Executed webhookHandler().");
  });

  it("should send 200 response", async () => {
    await webhookHandler(req as unknown as NextRequest);

    expect(NextResponse.json).toHaveBeenCalledWith({ message: "Webhook received", status: 200 });
  });

  it("should write webhook event data to postgres database", async () => {
    await webhookHandler(req as unknown as NextRequest);

    expect(insertWebhookEvent).toHaveBeenCalledWith(webhookEventCreate);
  });

  it("should execute getRawBody", async () => {
    await webhookHandler(req as unknown as NextRequest);

    expect(getRawBody).toHaveBeenCalled();
  });

  it("should verify signature", async () => {
    await webhookHandler(req as unknown as NextRequest);

    expect(isValidSignature).toHaveBeenCalledWith(JSON.stringify(webhookEventRequest), "valid_signature");
  });

  it("should send 400 response if signature is not valid", async () => {
    isValidSignature.mockReset();
    isValidSignature.mockReturnValueOnce(false);

    await webhookHandler(req as unknown as NextRequest);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Invalid signature", status: 400 });
    expect(insertWebhookEvent).not.toHaveBeenCalled();
  });
});