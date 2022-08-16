import Ably from "ably/promises";
import { randomUUID } from "crypto";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new Ably.Realtime(process.env.ABLY_PRIVATE_KEY!);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: randomUUID(),
  });
  res.status(200).json(tokenRequestData);
}
