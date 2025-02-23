import { NextRequest, NextResponse } from "next/server";
import { WebhookEventRequest } from "./shared.types";
import { insertWebhookEvent } from "./db";
import { SignatureVerifier } from "./SignatureVerifier";
import { Logger } from "./Logger";
import { getRawBody } from "./getRawBody";

// Middleware to prevent raw body processing by Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Generalized webhook handler for Lemon Squeezy
export const webhookHandler = async (
  req: NextRequest
) => {
  Logger.info('Executing webhookHandler().');
  // Use the custom middleware to capture the raw body
  // Parse the raw body into an event
  const rawBody = await getRawBody(req as NextRequest);

  let event: WebhookEventRequest;
  try {
    event = JSON.parse(rawBody) as WebhookEventRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON", status: 400 });
  }

  // Verify the signature
  const signature = req.headers.get("x-signature") as string;
  const signatureVerifier = new SignatureVerifier();
  if (!signatureVerifier.isValidSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature", status: 400 });
  }

  await insertWebhookEvent({
    event_name: event.meta.event_name,
    event_type: event.type,
    payload: JSON.stringify(event),
  });
  NextResponse.json({ message: "Webhook received", status: 200 });
  Logger.info('Executed webhookHandler().');
};
