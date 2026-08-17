'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { currentUser, hashPassword, requirePerm, ROLES } from '@/lib/auth';

function validRole(r: string): string {
  return (ROLES as readonly string[]).includes(r) ? r : 'ventas';
}

export async function createUser(formData: FormData) {
  await requirePerm('usuarios');
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const role = validRole(String(formData.get('role') ?? 'ventas'));
  if (!name || !email || password.length < 4) {
    redirect('/admin/usuarios?error=datos');
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) redirect('/admin/usuarios?error=duplicado');
  await prisma.user.create({
    data: { name, email, password: hashPassword(password), role },
  });
  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios');
}

export async function updateUser(formData: FormData) {
  await requirePerm('usuarios');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (isNaN(id)) redirect('/admin/usuarios');
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) redirect('/admin/usuarios');
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const role = validRole(String(formData.get('role') ?? target.role));
  if (!name || !email) redirect(`/admin/usuarios?editar=${id}&error=datos`);
  const dup = await prisma.user.findFirst({ where: { email, NOT: { id } } });
  if (dup) redirect(`/admin/usuarios?editar=${id}&error=duplicado`);
  if (target.role === 'superadmin' && role !== 'superadmin') {
    const supers = await prisma.user.count({
      where: { role: 'superadmin' },
    });
    if (supers <= 1) {
      redirect(`/admin/usuarios?editar=${id}&error=ultimo-super`);
    }
  }
  const data: { name: string; email: string; role: string; password?: string } =
    { name, email, role };
  if (password) {
    if (password.length < 4) {
      redirect(`/admin/usuarios?editar=${id}&error=clave`);
    }
    data.password = hashPassword(password);
  }
  await prisma.user.update({ where: { id }, data });
  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios');
}

export async function deleteUser(formData: FormData) {
  const me = await requirePerm('usuarios');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (isNaN(id)) redirect('/admin/usuarios');
  if (id === me.id) redirect('/admin/usuarios?error=vos');
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) redirect('/admin/usuarios');
  if (target.role === 'superadmin') {
    const supers = await prisma.user.count({
      where: { role: 'superadmin' },
    });
    if (supers <= 1) redirect('/admin/usuarios?error=ultimo-super');
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios');
}
