import { NextFunction } from "express";
import { IncomingMessage, ServerResponse } from "http";
import { NextApiRequest } from "next";

// Both NextApiRequest and Request extend IncomingMessage,
// so we can unify them in a single type to attach rawBody.
export type CombinedRequest = NextApiRequest | Request;

export interface RawBodyIncoming extends IncomingMessage {
  rawBody?: string;
}

/**
 * A middleware that handles capturing the raw body
 * for either an Express or Next.js request.
 */
function rawBodyMiddleware(
  req: CombinedRequest,
  res: ServerResponse, // or use NextApiResponse | Response if you wish
  next: NextFunction
) {
  let data = "";

  // Cast incoming request to an IncomingMessage so we can use .on events
  const incoming = req as RawBodyIncoming;

  incoming.on("data", (chunk: string) => {
    data += chunk;
  });

  incoming.on("end", () => {
    incoming.rawBody = data;
    next();
  });
}
export { rawBodyMiddleware };
