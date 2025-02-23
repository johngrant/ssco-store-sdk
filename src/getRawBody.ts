import { NextApiRequest } from "next";
import { Logger } from "./Logger";

async function getRawBody(req: NextApiRequest): Promise<string> {
  Logger.info('Executing getRawBody().');
  const request = req as unknown as Request;
  const rawbody = await request.text();
  Logger.info('Executed getRawBody().');
  Logger.info(`Raw body: ${JSON.stringify(rawbody)}`);
  return rawbody;
}

export { getRawBody };