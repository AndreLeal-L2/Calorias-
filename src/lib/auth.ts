import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "calorias_session";

const SESSION_MESSAGE = "calorias.personal.session.v1";

export function getAppSecret(): string {
  const secret = process.env.APP_SECRET;

  if (!secret) {
    throw new Error("APP_SECRET is not configured.");
  }

  return secret;
}

export function isValidSecretCode(candidate: string, expected: string): boolean {
  if (!candidate || !expected) {
    return false;
  }

  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);

  if (candidateBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, expectedBuffer);
}

export function createSessionToken(secret: string): string {
  return createHmac("sha256", secret).update(SESSION_MESSAGE).digest("hex");
}

export function verifySessionToken(token: string | undefined, secret: string): boolean {
  if (!token) {
    return false;
  }

  return isValidSecretCode(token, createSessionToken(secret));
}

export async function createSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, createSessionToken(getAppSecret()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  return verifySessionToken(token, getAppSecret());
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }
}
