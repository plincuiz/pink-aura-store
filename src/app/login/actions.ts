'use server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  createSession,
  hashPassword,
  roleHome,
  verifyPassword,
} from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const count = await prisma.user.count();
    if (
      count === 0 &&
      email === (process.env.ADMIN_EMAIL ?? '').toLowerCase() &&
      password === (process.env.ADMIN_PASSWORD ?? '')
    ) {
      user = await prisma.user.create({
        data: {
          name: 'Admin',
          email,
          password: hashPassword(password),
          role: 'superadmin',
        },
      });
    }
  }

  if (!user || !verifyPassword(password, user.password)) {
    redirect('/login?error=1');
  }
  await createSession(user.id);
  redirect(roleHome(user.role));
}
