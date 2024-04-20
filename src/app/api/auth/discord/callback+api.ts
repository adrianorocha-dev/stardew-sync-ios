import { OAuth2RequestError } from "arctic";
import { Cookie, parseCookies } from "oslo/cookie";
import { z } from "zod";

import { lucia } from "~/server/auth";
import { discord } from "~/server/auth/oauth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

async function fetchDiscordUser(accessToken: string) {
  const DiscordUserValidator = z.object({
    id: z.string(),
    username: z.string(),
    discriminator: z.string(),
    global_name: z.string().nullish(),
    avatar: z.string().nullish(),
  });

  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const responseBody = await response.json();

  const user = DiscordUserValidator.parse(responseBody);

  return user;
}

async function createResponseWithAuthCookie(cookie: Cookie) {
  const url = new URL(process.env.OAUTH_REDIRECT_URL!);

  url.searchParams.set("token", cookie.value);

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": cookie.serialize(),
    },
  });
}

export async function GET(request: Request) {
  const cookies = parseCookies(request.headers.get("Cookie") ?? "");
  const stateCookie = cookies.get("discord_oauth_state") ?? null;

  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  // Verify state
  if (!state || !stateCookie || !code || stateCookie !== state) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code);
    const discordUser = await fetchDiscordUser(tokens.accessToken);
    console.log("discord user:", discordUser);

    const existingUser = await db.query.users.findFirst({
      where: (model, op) => op.eq(model.discordId, discordUser.id),
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      return createResponseWithAuthCookie(sessionCookie);
    }

    const [createdUser] = await db
      .insert(users)
      .values({
        name:
          discordUser.global_name ??
          `${discordUser.username}#${discordUser.discriminator}`,
        avatarUrl: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
        discordId: discordUser.id,
      })
      .returning();

    if (!createdUser) {
      console.error("Failed to create user");
      return new Response(null, {
        status: 500,
      });
    }

    const session = await lucia.createSession(createdUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return createResponseWithAuthCookie(sessionCookie);
  } catch (e) {
    console.log(e);

    if (e instanceof OAuth2RequestError) {
      // bad verification code, invalid credentials, etc
      return new Response(null, {
        status: 400,
      });
    }

    return new Response(null, {
      status: 500,
    });
  }
}
