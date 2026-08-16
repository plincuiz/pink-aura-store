import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const SECRET = process.env.ADMIN_SECRET ?? 'secreto-desarrollo';
const COOKIE_NAME = 'pa_admin_session';

function expectedToken(): string {
  return createHmac('sha256', SECRET)
    .update('pink-aura-admin-session')
    .digest('hex');
}

export async function createSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const expected = expectedToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function checkCredentials(email: string, password: string): boolean {
  const okEmail =
    email.trim().toLowerCase() ===
    (process.env.ADMIN_EMAIL ?? '').toLowerCase();
  const okPass = password === (process.env.ADMIN_PASSWORD ?? '');
  return okEmail && okPass && password.length > 0;
}
