'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requirePerm } from '@/lib/auth';

export async function createSection(formData: FormData) {
  await requirePerm('secciones');
  const name = String(formData.get('name') ?? '').trim();
  if (!name) redirect('/admin/secciones?error=datos');
  const exists = await prisma.section.findUnique({ where: { name } });
  if (exists) redirect('/admin/secciones?error=duplicado');
  await prisma.section.create({ data: { name } });
  revalidatePath('/', 'layout');
  redirect('/admin/secciones');
}

export async function updateSection(formData: FormData) {
  await requirePerm('secciones');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (isNaN(id)) redirect('/admin/secciones');
  const name = String(formData.get('name') ?? '').trim();
  if (!name) redirect(`/admin/secciones?editar=${id}&error=datos`);
  const dup = await prisma.section.findFirst({
    where: { name, NOT: { id } },
  });
  if (dup) redirect(`/admin/secciones?editar=${id}&error=duplicado`);
  const active = formData.get('active') === 'on';
  await prisma.section.update({ where: { id }, data: { name, active } });
  revalidatePath('/', 'layout');
  redirect('/admin/secciones');
}

export async function deleteSection(formData: FormData) {
  await requirePerm('secciones');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (isNaN(id)) redirect('/admin/secciones');
  const withProducts = await prisma.product.count({
    where: { sectionId: id },
  });
  if (withProducts > 0) redirect('/admin/secciones?error=productos');
  const total = await prisma.section.count();
  if (total <= 1) redirect('/admin/secciones?error=ultima');
  await prisma.section.delete({ where: { id } });
  revalidatePath('/', 'layout');
  redirect('/admin/secciones');
}
