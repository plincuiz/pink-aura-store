'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { saveFile } from '@/lib/storage';
import { requirePerm } from '@/lib/auth';

export async function createSocial(formData: FormData) {
  await requirePerm('redes');
  const name = String(formData.get('name') ?? '').trim();
  const url = String(formData.get('url') ?? '').trim();
  const iconName = String(formData.get('iconName') ?? 'link').trim();
  if (!name || !url) redirect('/admin/redes');
  await prisma.socialNetwork.create({ data: { name, url, iconName } });
  revalidatePath('/', 'layout');
  redirect('/admin/redes');
}

export async function deleteSocial(formData: FormData) {
  await requirePerm('redes');
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!isNaN(id)) await prisma.socialNetwork.delete({ where: { id } });
  revalidatePath('/', 'layout');
  redirect('/admin/redes');
}

export async function updateLogo(formData: FormData) {
  await requirePerm('redes');
  const file = formData.get('logo');
  if (file && typeof file !== 'string' && file.size > 0) {
    const url = await saveFile(file, 'logo');
    await prisma.setting.upsert({
      where: { key: 'logoUrl' },
      update: { value: url },
      create: { key: 'logoUrl', value: url },
    });
  }
  revalidatePath('/', 'layout');
  redirect('/admin/redes');
}

export async function updateContact(formData: FormData) {
  await requirePerm('redes');
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  await prisma.setting.upsert({
    where: { key: 'contactPhone' },
    update: { value: phone },
    create: { key: 'contactPhone', value: phone },
  });
  await prisma.setting.upsert({
    where: { key: 'contactEmail' },
    update: { value: email },
    create: { key: 'contactEmail', value: email },
  });
  revalidatePath('/', 'layout');
  redirect('/admin/redes');
}
