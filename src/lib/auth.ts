import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const COOKIE = 'pa_session';

export type Perm =
  | 'panel'
  | 'productos'
  | 'productos-delete'
  | 'compras'
  | 'ventas'
  | 'pedidos'
  | 'pedidos-confirm'
  | 'pedidos-cancel'
  | 'pedidos-entregar'
  | 'redes'
  | 'usuarios'
  | 'secciones';

const ROLE_PERMS: Record<string, Perm[]> = {
  superadmin: [
    'panel', 'productos', 'productos-delete', 'compras', 'ventas',
    'pedidos', 'pedidos-confirm', 'pedidos-cancel', 'pedidos-entregar',
    'redes', 'usuarios', 'secciones',
  ],
  admin: [
    'panel', 'productos', 'compras', 'ventas', 'secciones',
    'pedidos', 'pedidos-confirm', 'pedidos-cancel', 'pedidos-entregar',
  ],
  ventas: ['ventas', 'pedidos', 'pedidos-confirm'],
};

export const ROLES = ['superadmin', 'admin', 'ventas'] as const;

function secret() {
  return process.env.ADMIN_SECRET ?? 'pink-aura-secret';
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const calc = crypto.scryptSync(password, salt, 32);
  const expected = Buffer.from(hash, 'hex');
  return (
    calc.length === expected.length &&
    crypto.timingSafeEqual(calc, expected)
  );
}

function sign(value: string): string {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export async function currentUser() {
  const cookieStore = await cookies();
  const c = cookieStore.get(COOKIE)?.value;
  if (!c) return null;
  const [id, sig] = c.split('.');
  if (!id || sig !== sign(id)) return null;
  return prisma.user.findUnique({ where: { id: Number(id) } });
}

export async function isAdmin(): Promise<boolean> {
  return (await currentUser()) != null;
}

export function roleCan(role: string, perm: Perm): boolean {
  return (ROLE_PERMS[role] ?? []).includes(perm);
}

export async function can(perm: Perm): Promise<boolean> {
  const u = await currentUser();
  return !!u && roleCan(u.role, perm);
}

export function roleHome(role: string): string {
  if (roleCan(role, 'panel')) return '/admin';
  if (roleCan(role, 'pedidos')) return '/admin/pedidos';
  return '/login';
}

export async function requirePerm(perm: Perm) {
  const u = await currentUser();
  if (!u) redirect('/login');
  if (!roleCan(u.role, perm)) redirect(roleHome(u.role));
  return u;
}

export async function createSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, `${userId}.${sign(String(userId))}`, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
