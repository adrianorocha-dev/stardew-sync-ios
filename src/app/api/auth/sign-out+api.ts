import { lucia } from "~/server/auth";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const sessionId = lucia.readBearerToken(authHeader ?? "");

  if (!sessionId) {
    return new Response(null, { status: 200 });
  }

  await lucia.invalidateSession(sessionId);

  return new Response(null, { status: 200 });
}
