import { NextApiRequest, NextApiResponse } from "next";
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
  req: NextApiRequest,
  res: NextApiResponse
) => {
  Logger.info('Executing webhookHandler().');
  // Use the custom middleware to capture the raw body
  // Parse the raw body into an event
  const rawBody = await getRawBody(req as NextApiRequest);

  let event: WebhookEventRequest;
  try {
    event = JSON.parse(rawBody) as WebhookEventRequest;
  } catch {
    return res.status(400).send("Invalid JSON");
  }

  // Verify the signature
  const signature = req.headers["x-signature"] as string;
  const signatureVerifier = new SignatureVerifier();
  if (!signatureVerifier.isValidSignature(rawBody, signature)) {
    return res.status(400).send("Invalid signature");
  }

  await insertWebhookEvent({
    event_name: event.meta.event_name,
    event_type: event.type,
    payload: JSON.stringify(event),
  });
  res.status(200).send("Webhook received");
  Logger.info('Executed webhookHandler().');
};
