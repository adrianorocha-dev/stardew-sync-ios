import { generateState } from "arctic";
import { serializeCookie } from "oslo/cookie";

import { discord } from "~/server/auth/oauth";

export async function GET() {
  const state = generateState();
  const url = await discord.createAuthorizationURL(state, {
    scopes: ["identify"],
  });
  console.log({ url });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": serializeCookie("discord_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 60,
        path: "/",
      }),
    },
  });
}
