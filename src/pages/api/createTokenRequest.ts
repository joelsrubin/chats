import Ably from "ably/promises";

import { NextApiResponse, NextApiRequest } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "./auth/[...nextauth]";
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const client = new Ably.Realtime(process.env.ABLY_PRIVATE_KEY!);
  const session = await getServerSession(_req, res, nextAuthOptions);

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: session?.user?.name as string,
  });
  res.status(200).json(tokenRequestData);
}
