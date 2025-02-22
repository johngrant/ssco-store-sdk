import { NextApiRequest, NextApiResponse } from "next";
import { Request, Response } from "express";
import { WebhookEventRequest } from "./shared.types";
import { insertWebhookEvent } from "./db";
import { CombinedRequest, RawBodyIncoming, rawBodyMiddleware } from "./middleware";
import SignatureVerifier from "./SignatureVerifier";
import { Logger } from "./Logger";

// Generalized webhook handler for Lemon Squeezy
export const webhookHandler = async (
  req: Request | NextApiRequest,
  res: Response | NextApiResponse
) => {
  Logger.info('Executing webhookHandler().');
  // Use the custom middleware to capture the raw body
  await new Promise((resolve, reject) => {
    rawBodyMiddleware(req as CombinedRequest, res, (err) => {
      if (err) reject(err);
      else resolve(null);
    });
  });

  const rawBody = (req as RawBodyIncoming).rawBody || "";

  // Parse the raw body into an event
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
