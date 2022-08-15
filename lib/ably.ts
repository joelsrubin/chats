import Ably from "ably";

const secret = process.env.ABLY_PRIVATE_KEY;
console.log(secret);
export const ably = new Ably.Realtime(secret || "");
