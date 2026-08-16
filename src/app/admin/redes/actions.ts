'use server';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function createSocial(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const url = String(formData.get('url') ?? '').trim();
  const iconName = String(formData.get('iconName') ?? 'link').trim();
  if (!name || !url) redirect('/admin/redes');
  await prisma.socialNetwork.create({ data: { name, url, iconName } });
  revalidatePath('/', 'layout');
  redirect('/admin/redes');
}

export async function deleteSocial(formData: FormData) {
  const id = parseInt(String(formData.get('id') ?? ''), 10);
  if (!isNaN(id)) await prisma.socialNetwork.delete({ where: { id } });
  revalidatePath('/', 'layout');
  redirect('/admin/redes');
}

export async function updateLogo(formData: FormData) {
  const file = formData.get('logo');
  if (file && typeof file !== 'string' && file.size > 0) {
    const dir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(dir, { recursive: true });
    const ext = (file.name.split('.').pop() ?? 'png').toLowerCase();
    const name = `logo-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, name), buffer);
    await prisma.setting.upsert({
      where: { key: 'logoUrl' },
      update: { value: `/uploads/${name}` },
      create: { key: 'logoUrl', value: `/uploads/${name}` },
    });
  }
  revalidatePath('/', 'layout');
  redirect('/admin/redes');
}

export async function updateContact(formData: FormData) {
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
