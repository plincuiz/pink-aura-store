'use server';

import { redirect } from 'next/navigation';
import { checkCredentials, createSessionCookie } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!checkCredentials(email, password)) {
    redirect('/login?error=1');
  }

  await createSessionCookie();
  redirect('/admin');
}
